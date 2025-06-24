import { ObjectId } from "mongoose";

export interface IBooking {
  productId: ObjectId;
  bookingQuantity: number;
  userId: ObjectId;
  orderId?: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}