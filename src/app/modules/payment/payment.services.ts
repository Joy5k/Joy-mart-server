import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import { IPaymentData } from './payment.interface';
import { PaymentStatus } from './payment.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Payment } from './payment.model';

const assertSSLCommerzConfig = () => {
  if (!config.sslcommerz?.store_id || !config.sslcommerz?.store_password) {
    throw new Error('SSLCommerz credentials are not configured');
  }
  return {
    store_id: config.sslcommerz.store_id,
    store_passwd: config.sslcommerz.store_password,
    is_live: config.sslcommerz.is_live || false
  };
};

const { store_id, store_passwd, is_live } = assertSSLCommerzConfig();

const initiatePayment = async (paymentData: IPaymentData) => {
  const transactionId = `JMART_TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

  if (paymentData.paymentMethod === 'cod') {
    // Create new payment for COD
     await Payment.create({
      userId: paymentData.userId,
      productIds: paymentData.productIds, // Changed from bookingIds to productIds
      orderId: transactionId,
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      paymentMethod: 'cod',
      totalAmount: paymentData.total_amount,
      shippingAddress: paymentData.shippingAddress,
      contactInfo: {
        phone: paymentData.customer.phone,
        email: paymentData.customer.email
      }
    });
    
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
    success_url: `https://joy-mart.vercel.app/payment/success/${transactionId}`,
    fail_url: `https://joy-mart.vercel.app/payment/fail/${transactionId}`,
    cancel_url: `https://joy-mart.vercel.app/payment/cancel/${transactionId}`,
    cus_name: paymentData.customer.name,
    cus_email: paymentData.customer.email,
    cus_phone: paymentData.customer.phone || '01601588531',
    cus_add1: paymentData.customer.address || 'N/A',
    shipping_method: 'NO',
    product_profile: 'non-physical-goods',
    product_name: 'Booking Payment',       
    product_category: 'Service'           
  };

  try {
    const apiResponse = await sslcz.init(sslcommerzData);
    
    if (!apiResponse?.GatewayPageURL) {
      throw new Error('Payment initiation failed');
    }

    // Create new payment for online payment
    await Payment.create({
      userId: paymentData.userId,
      productIds: paymentData.productIds, // Changed from bookingIds to productIds
      orderId: transactionId,
      paymentStatus: 'pending',
      paymentMethod: 'online',
      totalAmount: paymentData.total_amount,
      shippingAddress: paymentData.shippingAddress,
      contactInfo: {
        phone: paymentData.customer.phone,
        email: paymentData.customer.email
      }
    });

    return { paymentUrl: apiResponse.GatewayPageURL, transactionId };
  } catch (error) {
    // Create failed payment record
    await Payment.create({
      userId: paymentData.userId,
      productIds: paymentData.productIds,
      paymentStatus: 'failed',
      totalAmount: paymentData.total_amount
    });
    
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment failed');
  }
};


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

const handleIPN = async (ipnData: { tran_id: string; status: string }) => {
  if (ipnData.status === 'VALID') {
    await Payment.updateMany(
      { orderId: ipnData.tran_id },
      { $set: { paymentStatus: PaymentStatus.PAID } }
    );
  }
  return { success: true };
};

const trackOrderStatus = async (transactionId: string, userId: string) => {
  const booking = await Payment.findOne({ orderId: transactionId, userId });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  return booking;
};
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