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
    }
  },
  { 
    timestamps: true,
  }
);

// Add indexes for better performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ orderStatus: 1 });
bookingSchema.index({ createdAt: -1 });

export const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);