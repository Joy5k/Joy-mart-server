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

    // 2. Check for existing booking of same product by same user
    const existingBooking = await BookingModel.findOne({
      productId: bookingData.productId,
      userId: bookingData.userId,
      orderStatus: { $nin: ['cancelled', 'delivered'] } // Exclude completed/cancelled bookings
    }).session(session);

    let booking;
    let quantityToBook = bookingData.bookingQuantity;

    if (existingBooking) {
      // 3a. Update existing booking if found
      const newQuantity = existingBooking.bookingQuantity + bookingData.bookingQuantity;
      
      if (product.stock < newQuantity) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient product quantity for additional booking');
      }

      existingBooking.bookingQuantity = newQuantity;
      booking = await existingBooking.save({ session });
      quantityToBook = bookingData.bookingQuantity; 
    } else {
      // 3b. Create new booking if no existing one
      if (product.stock < bookingData.bookingQuantity) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient product quantity');
      }
      const newBooking = await BookingModel.create([bookingData], { session });
      booking = newBooking[0];
    }

    // 4. Update product stock and isActive status
    const updatedStock = product.stock - quantityToBook;
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
    return booking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getBookingsByUser = async (userId: string) => {
  try {
    const bookings = await BookingModel.find({ userId })
      .populate({
        path: 'userId',
        select: 'name email',
        model: 'User'
      })
      .populate({
        path: 'productId',
        select: 'title price images stock isActive',
        model: 'Product'
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!bookings || bookings.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, 'No bookings found for this user');
    }

    return bookings.map(booking => ({
      ...booking.toObject(),
      // Add calculated fields if needed
      totalPrice: booking.bookingQuantity * (booking.productId as any).price
    }));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve bookings'
    );
  }
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
    // Convert string IDs to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(payload.productId);
    const userObjectId = new mongoose.Types.ObjectId(payload.userId);

    // 1. Find the booking - querying nested _id fields
    const booking = await BookingModel.findOne({
         productId: payload.productId,
          userId: payload.userId,
    }).session(session);
    console.log(booking)
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'No bookings found for this product and user');
    }

    // 2. Restore product stock if booking wasn't already cancelled
    if (booking.orderStatus !== 'cancelled') {
      const product = await ProductModel.findById(productObjectId).session(session);
      
      if (product) {
        const updatedStock = product.stock + booking.bookingQuantity;
        await ProductModel.findByIdAndUpdate(
          productObjectId,
          {
            $set: {
              stock: updatedStock,
              isActive: updatedStock > 0 ? true : product.isActive
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