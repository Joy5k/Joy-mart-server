// src/modules/payment/payment.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.services';

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const { bookingIds, total_amount, currency, customer } = req.body;
  
  if (!bookingIds || !total_amount || !customer) {
    throw new Error('Missing required fields');
  }

  const result = await PaymentService.initiatePayment({
    bookingIds,
    total_amount,
    currency,
    customer
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  
  const result = await PaymentService.validatePayment(transactionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment validated successfully',
    data: result
  });
});

const paymentIPN = catchAsync(async (req: Request, res: Response) => {
 const result= await PaymentService.handleIPN(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'IPN handled successfully',
    data:result
  });
});

export const PaymentController = {
  initiatePayment,
  validatePayment,
  paymentIPN
};