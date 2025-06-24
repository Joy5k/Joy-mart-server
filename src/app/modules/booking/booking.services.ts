import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IBooking } from './booking.interface';
import { BookingModel } from './booking.model';
import { ProductModel } from '../product/product.model'; // Import ProductModel
import AppError from '../../errors/AppError';

const createBooking = async (bookingData: IBooking) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check product availability
    const product = await ProductModel.findById(bookingData.productId).session(session);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    if (product.stock < bookingData.bookingQuantity) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient product quantity');
    }

    // 2. Create booking
    const booking = await BookingModel.create([bookingData], { session });

    // 3. Update product stock and isActive status
    const updatedStock = product.stock - bookingData.bookingQuantity;
    const isActive = updatedStock > 0;

    await ProductModel.findByIdAndUpdate(
      bookingData.productId,
      {
        $set: {
          stock: updatedStock,
          isActive
        }
      },
      { session }
    );

    await session.commitTransaction();
    return booking[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getBookingsByUser = async (userId: string) => {
  return BookingModel.find({ userId })
    .populate('userId', 'name email')
    .populate('productId', 'title price images stock isActive');
};

const getBookingById = async (bookingId: string, userId?: string) => {
  const query: any = { _id: bookingId };
  if (userId) query.userId = userId;

  const booking = await BookingModel.findOne(query)
    .populate('userId', 'name email')
    .populate('productId', 'title price images stock isActive');

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

const updateBookingStatus = async (
  bookingId: string,
  status: IBooking['orderStatus'],
  userId?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const query: any = { _id: bookingId };
    if (userId) query.userId = userId;

    // Users can only cancel their own bookings
    const allowedStatuses = ['cancelled'];
    if (userId && !allowedStatuses.includes(status)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only cancel bookings');
    }

    const booking = await BookingModel.findOne(query).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    // Handle stock restoration if booking is cancelled
    if (status === 'cancelled' && booking.orderStatus !== 'cancelled') {
      const product = await ProductModel.findById(booking.productId).session(session);
      if (product) {
        const updatedStock = product.stock + booking.bookingQuantity;
        await ProductModel.findByIdAndUpdate(
          booking.productId,
          {
            $set: {
              stock: updatedStock,
              isActive: true // Reactivate product if it was inactive
            }
          },
          { session }
        );
      }
    }

    const updatedBooking = await BookingModel.findOneAndUpdate(
      query,
      { orderStatus: status },
      { new: true, session }
    )
      .populate('userId', 'name email')
      .populate('productId', 'title price images stock isActive');

    await session.commitTransaction();
    return updatedBooking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const deleteBookingProduct = async (payload: { productId: string, userId: string }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the booking
    const booking = await BookingModel.findOne({
      productId: payload.productId,
      userId: payload.userId
    }).session(session);

    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found for this product and user');
    }

    // 2. Restore product stock if booking wasn't already cancelled
    if (booking.orderStatus !== 'cancelled') {
      const product = await ProductModel.findById(booking.productId).session(session);
      if (product) {
        const updatedStock = product.stock + booking.bookingQuantity;
        await ProductModel.findByIdAndUpdate(
          booking.productId,
          {
            $set: {
              stock: updatedStock,
              isActive: true // Reactivate product if it was inactive
            }
          },
          { session }
        );
      }
    }

    // 3. Delete the booking
    const result = await BookingModel.findByIdAndDelete(booking._id, { session });

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};



const getAllBookings = async (filters: any = {}) => {
  return BookingModel.find(filters)
    .populate('userId', 'name email')
    .populate('productId', 'title price images stock isActive')
    .sort({ createdAt: -1 });
};

export const bookingServices = {
  createBooking,
  getBookingsByUser,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
  deleteBookingProduct
};