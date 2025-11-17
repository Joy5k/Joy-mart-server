import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import { IPaymentData } from './payment.interface';
import { PaymentStatus } from './payment.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Payment } from './payment.model';
import mongoose from 'mongoose';
import { ProductModel } from '../product/product.model';

const assertSSLCommerzConfig = () => {
  if (!config.sslcommerz?.store_id || !config.sslcommerz?.store_password) {
    throw new Error('SSLCommerz credentials are not configured');
  }
  return {
    store_id: config.sslcommerz.store_id,
    store_passwd: config.sslcommerz.store_password,
    is_live: config.sslcommerz.is_live || false // Default to false, Make it true for production then will be solve the redirect bug
  };
};

const { store_id, store_passwd, is_live } = assertSSLCommerzConfig();

// Initiate Payment
const initiatePayment = async (paymentData: IPaymentData) => {
  const session = await mongoose.startSession();

  const transactionId = `JMART_TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Transform productIds to match schema structure
  const transformedProductIds = paymentData.productIds.map(product => {
    if (typeof product === 'string') {
      return {
        productId: new mongoose.Types.ObjectId(product),
        productQuantity:paymentData.productQuantity || 1
      };
    } else {
      return {
        productId: new mongoose.Types.ObjectId(product.productId),
        productQuantity: product.productQuantity
      };
    }
  });

  // Create payment data object that matches schema
  const paymentCreateData = {
    userId: new mongoose.Types.ObjectId(paymentData.userId),
    productIds: transformedProductIds,
    orderId: transactionId,
    paymentStatus: 'pending' as const,
    orderStatus: paymentData.paymentMethod === 'cod' ? 'confirmed' as const : 'pending' as const,
    paymentMethod: paymentData.paymentMethod as 'cod' | 'online',
    totalAmount: paymentData.total_amount,
    shippingAddress: paymentData.shippingAddress,
    contactInfo: {
      phone: paymentData.customer.phone,
      email: paymentData.customer.email
    }
  };

  if (paymentData.paymentMethod === 'cod') {
    await Payment.create([paymentCreateData]);
    return { paymentMethod: 'cod', transactionId };
  }

  const sslcz = new SSLCommerzPayment(
    config.sslcommerz.store_id!,
    config.sslcommerz.store_password!,
    false 
  );

  const sslcommerzData = {
    total_amount: paymentData.total_amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${config.frontend_url}/payment/success/${transactionId}`,
    fail_url: `${config.frontend_url}/payment/fail/${transactionId}`,
    cancel_url: `${config.frontend_url}/payment/cancel/${transactionId}`,
    cus_name: paymentData.customer.name,
    cus_email: paymentData.customer.email,
    cus_phone: paymentData.customer.phone || '01601588531',
    cus_add1: paymentData.customer.address || 'N/A',
    shipping_method: 'NO',
    product_profile: 'non-physical-goods',
    product_name: 'Product Payment', 
    product_category: 'General' 
  };

try {
  session.startTransaction();
  
  // 1. Check stock availability and validate quantities before payment
  const productIds = transformedProductIds.map(p => p.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } }).session(session);
  
  // Validate stock for each product
  for (const item of transformedProductIds) {
    const product = products.find(p => p._id.toString() === item.productId.toString());
    console.log({paymentData,product})
    if (!product) {
      throw new AppError(httpStatus.BAD_REQUEST, `Product not found: ${item.productId}`);
    }
    
    if (product.stock < item.productQuantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST, 
        `Insufficient stock for product: ${product.title}. Available: ${product.stock}, Requested: ${item.productQuantity}`
      );
    }
  }

  const apiResponse = await sslcz.init(sslcommerzData);
  
  if (!apiResponse?.GatewayPageURL) {
      await session.abortTransaction();

    throw new Error('Payment initiation failed at SSLCommerz');
  }

  // Create payment record
  await Payment.create([paymentCreateData], { session });

  // Update stock for each product and handle zero stock scenario
  for (const item of transformedProductIds) {
    const product = products.find(p => p._id.toString() === item.productId.toString());
    if(!product){
      throw new AppError(httpStatus.BAD_REQUEST, `Product not found during stock update: ${item.productId}`);
    }
    const newStock = product.stock - item.productQuantity;
    
    // Update stock and check if stock becomes zero
    const updateData: any = { 
      $inc: { stock: -item.productQuantity } 
    };
    
    // If stock becomes zero or less, deactivate the product
    if (newStock <= 0) {
      updateData.$set = { 
        isActive: false, 
        isDeleted: true,
        stock: 0 //
      };
    }
    
    await ProductModel.updateOne(
      { _id: item.productId },
      updateData,
      { session }
    );
  }

  await session.commitTransaction();
  
  return { paymentUrl: apiResponse.GatewayPageURL, transactionId };
} catch (error) {
  await session.abortTransaction();
  console.error('Payment initiation error:', error);
  
  // Create failed payment
  await Payment.create([{
    ...paymentCreateData,
    paymentStatus: 'failed' as const,
    orderStatus: 'cancelled' as const
  }]);
  
  // If it's a stock-related error, throw that specific error
  if (error instanceof AppError && error.message.includes('stock')) {
    throw error;
  }
  
  throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong during payment initiation');
} finally {
  session.endSession();
}
};
// Validate Payment
const validatePayment = async (transactionId: string) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const response = await sslcz.validate({ val_id: transactionId });

  const status = response.status === 'VALID' 
    ? PaymentStatus.PAID 
    : PaymentStatus.FAILED;

  await Payment.updateMany(
    { orderId: transactionId },
    { 
      $set: { 
        paymentStatus: status,
        ...(status === PaymentStatus.PAID && {
          orderStatus: 'confirmed',
          paymentDetails: {
            amount: response.amount,
            cardType: response.card_type
          }
        })
      } 
    }
  );

  return { success: status === PaymentStatus.PAID };
};

// Handle Payment IPN
const handleIPN = async (ipnData: { tran_id: string; status: string }) => {
  if (ipnData.status === 'VALID') {
    await Payment.updateMany(
      { orderId: ipnData.tran_id },
      { $set: { paymentStatus: PaymentStatus.PAID } }
    );
  }
  return { success: true };
};

// Track Order Status
const trackOrderStatus = async (transactionId: string, userId: string) => {
  const booking = await Payment.findOne({ orderId: transactionId, userId });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  return booking;
};

// Get All Order History for a User
const getAllOrderHistory = async (userId: string) => {
  try {
 

    // Find orders only for the specific user
    const orders = await Payment.find({ userId})
      .populate('userId', 'name email') // Basic user info
      .populate('productIds') // All product details
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // Convert to plain JS object

    return orders;
  } catch (error) {
    console.error('Error fetching user order history:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to retrieve order history');
  }
};
export const PaymentService = {
  initiatePayment,
  validatePayment,
  handleIPN,
  trackOrderStatus,
  getAllOrderHistory
};