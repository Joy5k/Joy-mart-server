// src/routes/paymentRoutes.ts
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { PaymentController } from './payment.controller';


const router = express.Router();

router.post('/initiate',auth(USER_ROLE.user,USER_ROLE.seller,USER_ROLE.admin,USER_ROLE.superAdmin), PaymentController.initiatePayment);
router.post('/validate/:transactionId',auth(USER_ROLE.user,USER_ROLE.seller,USER_ROLE.admin,USER_ROLE.superAdmin), PaymentController.validatePayment);
router.post('/ipn',auth(USER_ROLE.user,USER_ROLE.seller,USER_ROLE.admin,USER_ROLE.superAdmin), PaymentController.paymentIPN);
router.get('/track/:transactionId', auth(USER_ROLE.user, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), PaymentController.trackOrder);
router.get('/history', auth(USER_ROLE.user, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), PaymentController.getAllOrderHistoryFromDB);
// for ssl commerz redirect URLs, no auth middleware
router.get('/success/:transactionId', PaymentController.paymentSuccessRedirect);
router.get('/fail/:transactionId', PaymentController.paymentFailRedirect);
router.get('/cancel/:transactionId', PaymentController.paymentCancelRedirect);

export const PaymentRoute = router;
