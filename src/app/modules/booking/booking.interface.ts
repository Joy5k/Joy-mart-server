import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'online' | 'cod' | 'wallet';

export interface IBooking extends Document {
  productId: Types.ObjectId;
  bookingQuantity: number;
  userId: Types.ObjectId;
  orderId?: string | null;
  orderStatus: OrderStatus;
  transactionId?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  totalAmount?: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactInfo?: {
    phone: string;
    email: string;
  };
  paymentDetails?: {
    amount?: number;
    currency?: string;
    paymentGateway?: string;
    transactionTime?: Date;
    cardLast4?: string;
  };
  trackingInfo?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}