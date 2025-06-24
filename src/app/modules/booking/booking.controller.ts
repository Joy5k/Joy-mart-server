import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { bookingServices } from './booking.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { verifyToken } from '../Auth/auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingData = req.body;
  const token = req.cookies?.authToken; 
  const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload
  bookingData.userId=userId
  
  const result = await bookingServices.createBooking(bookingData);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.authToken; 
  const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;
  const result = await bookingServices.getBookingsByUser(userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result
  });
});

const getBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.cookies?.authToken; 
  const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
  const result = await bookingServices.getBookingById(id, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking retrieved successfully',
    data: result
  });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const token = req.cookies?.authToken; 
  const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
  const isAdmin = req.user?.role === 'admin';
  const result = await bookingServices.updateBookingStatus(
    id, 
    status, 
    isAdmin ? undefined : userId
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking status updated successfully',
    data: result
  });
});

const getAllBookingsForAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServices.getAllBookings(req.query);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All bookings retrieved successfully',
    data: result
  });
});
const deleteBookingProduct = catchAsync(async (req: Request, res: Response) => {
  // 1. Verify authentication
  const token = req.cookies?.authToken;
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication token missing');
  }

  // 2. Verify and decode token
  const decoded = verifyToken(token, config.jwt_access_secret as string) as JwtPayload;
  if (!decoded?.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload');
  }

  // 3. Get product ID from params
  const { productId } = req.params;
  if (!productId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product ID is required');
  }

  // 4. Prepare payload
  const payload = {
    productId,
    userId: decoded.userId
  };

  // 5. Call service
  const result = await bookingServices.deleteBookingProduct(payload);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found or already deleted');
  }

  // 6. Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking deleted successfully',
    data: result
  });
});

export const bookingController = {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  getAllBookingsForAdmins,
  deleteBookingProduct
};