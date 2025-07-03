import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { bookingValidation } from './booking.validation';
import { bookingController } from './booking.controller';


const router = express.Router();

// User routes
router.post(
  '/',
  // auth(USER_ROLE.user,USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.seller),
  validateRequest(bookingValidation.createBookingSchema),
  bookingController.createBooking
);

router.get(
  '/my-bookings',
  auth(USER_ROLE.user,USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.seller),
  bookingController.getUserBookings
);

router.get(
  '/:id',
  auth(USER_ROLE.user,USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.seller),
  validateRequest(bookingValidation.bookingIdSchema),
  bookingController.getBooking
);

router.patch(
  '/:id/status',
  auth(USER_ROLE.user,USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.seller),
  validateRequest(bookingValidation.bookingIdSchema),
  bookingController.updateBooking
);

router.delete('/delete/:bookingId',auth(USER_ROLE.user,USER_ROLE.admin,USER_ROLE.superAdmin,USER_ROLE.seller),bookingController.deleteBookingProduct)



// Admin routes
router.get(
  '/',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  bookingController.getAllBookingsForAdmins
);

export const bookingRoutes = router;