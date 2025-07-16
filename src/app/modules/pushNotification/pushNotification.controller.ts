import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { verifyToken } from '../Auth/auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import { pushNotificationServices } from './pushNotification.services';

const submitToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const authToken = req.cookies?.authToken;
  
  let userId: string | undefined;
  if (authToken) {
    const decoded = verifyToken(authToken, config.jwt_access_secret as string) as JwtPayload;
    userId = decoded.userId;
  }

  const result = await pushNotificationServices.saveToken({ token, userId });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Token saved successfully',
    data: result
  });
});

const sendNotification = catchAsync(async (req: Request, res: Response) => {
  const { title, body, data } = req.body;
  const response = await pushNotificationServices.sendNotification({ 
    title, 
    body,
    data
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification sent successfully',
    data: response
  });
});

const getUserNotificationTokens = catchAsync(async (req: Request, res: Response) => {
  const authToken = req.cookies?.authToken;
  const decoded = verifyToken(authToken, config.jwt_access_secret as string) as JwtPayload;
  
  const result = await pushNotificationServices.getUserTokens(decoded.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User tokens retrieved successfully',
    data: result
  });
});

const removeToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await pushNotificationServices.deleteToken(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token removed successfully',
    data: result
  });
});

export const pushNotificationController = {
  submitToken,
  sendNotification,
  getUserNotificationTokens,
  removeToken
};