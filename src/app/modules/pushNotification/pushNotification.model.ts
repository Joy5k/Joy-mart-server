import { Schema, model } from 'mongoose';
import { IPushNotification } from './pushNotification.interface';

const pushNotificationSchema = new Schema<IPushNotification>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: false }
  },
  { timestamps: true }
);

export const PushNotification = model<IPushNotification>(
  'PushNotification',
  pushNotificationSchema
);