import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    bookingQuantity: z.number().min(1, 'Quantity must be at least 1')
  })
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
  })
});

export const bookingIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required')
  })
});

export const bookingValidation = {
  createBookingSchema,
  updateBookingStatusSchema,
  bookingIdSchema
};