import SSLCommerzPayment from 'sslcommerz-lts';
import { BookingModel } from '../booking/booking.model';
import config from '../../config';
import { IPaymentData } from './payment.interface';
import { PaymentStatus } from './payment.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// Validate and assert SSLCommerz credentials
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
    await BookingModel.updateMany(
      { _id: { $in: paymentData.bookingIds } },
      {
        orderId: transactionId,
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
        paymentMethod: 'cod',
        totalAmount: paymentData.total_amount
      }
    );
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
    shipping_method: 'NO', // For digital services
    product_profile: 'non-physical-goods', // ← Critical field
    product_name: 'Booking Payment',       
    product_category: 'Service'           
  };

   try {
    const apiResponse = await sslcz.init(sslcommerzData);
    
    if (!apiResponse?.GatewayPageURL) {
      throw new Error('Payment initiation failed');
    }

    await BookingModel.updateMany(
      { _id: { $in: paymentData.bookingIds } },
      {
        orderId: transactionId,
        paymentStatus: 'pending',
        paymentMethod: 'online'
      }
    );

    return { paymentUrl: apiResponse.GatewayPageURL, transactionId };
  } catch (error) {
    await BookingModel.updateMany(
      { _id: { $in: paymentData.bookingIds } },
      { paymentStatus: 'failed' }
    );
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment failed');
  }
};

const validatePayment = async (transactionId: string) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const response = await sslcz.validate({ val_id: transactionId });

  const status = response.status === 'VALID' 
    ? PaymentStatus.PAID 
    : PaymentStatus.FAILED;

  await BookingModel.updateMany(
    { transactionId },
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
    await BookingModel.updateMany(
      { transactionId: ipnData.tran_id },
      { $set: { paymentStatus: PaymentStatus.PAID } }
    );
  }
  return { success: true };
};

export const PaymentService = {
  initiatePayment,
  validatePayment,
  handleIPN
};