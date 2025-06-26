// src/routes/paymentRoutes.ts
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { PaymentController } from './payment.controller';


const router = express.Router();

router.post('/initiate',auth(USER_ROLE.user,USER_ROLE.seller,USER_ROLE.admin,USER_ROLE.superAdmin), PaymentController.initiatePayment);
router.post('/validate/:transactionId',auth(USER_ROLE.user,USER_ROLE.seller,USER_ROLE.admin,USER_ROLE.superAdmin), PaymentController.validatePayment);
router.post('/ipn',auth(USER_ROLE.user,USER_ROLE.seller,USER_ROLE.admin,USER_ROLE.superAdmin), PaymentController.paymentIPN);

export const PaymentRoute = router;
