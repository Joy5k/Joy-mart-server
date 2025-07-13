import httpStatus from 'http-status';
import admin from 'firebase-admin';
import { PushNotification } from './pushNotification.model';
import { IPushNotification, INotificationPayload } from './pushNotification.interface';
import AppError from '../../errors/AppError';

const saveToken = async (tokenData: IPushNotification): Promise<IPushNotification> => {
  try {
    const existingToken = await PushNotification.findOne({ token: tokenData.token });
    if (existingToken) {
      return existingToken;
    }
    const result = await PushNotification.create(tokenData);
    return result;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to save notification token'
    );
  }
};

const sendNotification = async (payload: INotificationPayload) => {
  const session = await PushNotification.startSession();
  session.startTransaction();

  try {
    const allTokens = await PushNotification.find().select('token').session(session);
    if (allTokens.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No tokens available');
    }

    const tokens = allTokens.map(item => item.token);

    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      tokens,
      data: payload.data || {}
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    await session.commitTransaction();
    return response;
  } catch (error:any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Notification failed: ${error.message}`
    );
  } finally {
    session.endSession();
  }
};

const getUserTokens = async (userId: string) => {
  try {
    const result = await PushNotification.find({ userId });
    return result;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve user tokens'
    );
  }
};

const deleteToken = async (token: string) => {
  const session = await PushNotification.startSession();
  session.startTransaction();

  try {
    const result = await PushNotification.findOneAndDelete({ token }).session(session);
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, 'Token not found');
    }
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const pushNotificationServices = {
  saveToken,
  sendNotification,
  getUserTokens,
  deleteToken
};