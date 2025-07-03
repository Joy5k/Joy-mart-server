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
 
  },
  { 
    timestamps: true,
  }
);

// Sparse unique index - only enforces uniqueness for non-null values
bookingSchema.index({ orderId: 1 }, { unique: true, sparse: true });

// Other indexes
bookingSchema.index({ userId: 1 });
bookingSchema.index({ productId: 1, userId: 1, orderId: 1 }); // New compound index
// Other indexes remain the same
bookingSchema.index({ orderStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

export const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);