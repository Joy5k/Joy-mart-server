import mongoose, { Schema } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>(
  {
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    bookingQuantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    orderId: { 
      type: String 
    },
    orderStatus: { 
      type: String, 
      required: true,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    // New fields for payment and tracking
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cod', 'wallet']
    },
    totalAmount: Number,
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    contactInfo: {
      phone: String,
      email: String
    },
    paymentDetails: {
      amount: Number,
      currency: { type: String, default: 'BDT' },
      paymentGateway: String,
      transactionTime: Date,
      cardLast4: String
    },
    trackingInfo: {
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: Date,
      actualDelivery: Date
    }
  },
  { 
    timestamps: true,
  }
);

// Indexes for better performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ orderStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ orderId: 1 }, { unique: true });

export const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);