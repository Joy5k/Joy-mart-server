// TypeScript interfaces
export interface IPushNotification {
  token: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}