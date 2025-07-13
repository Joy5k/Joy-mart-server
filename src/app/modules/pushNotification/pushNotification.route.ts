import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { pushNotificationController } from './pushNotification.controller';
import { pushNotificationValidation } from './pushNotification.validation';

const router = express.Router();

// Public route for token submission (no auth required)
router.post(
  '/submit-token',
  validateRequest(pushNotificationValidation.submitTokenSchema),
  pushNotificationController.submitToken
);

// Authenticated routes
router.post(
  '/send-notification',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(pushNotificationValidation.sendNotificationSchema),
  pushNotificationController.sendNotification
);

router.get(
  '/my-tokens',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.seller),
  pushNotificationController.getUserNotificationTokens
);

router.delete(
  '/remove-token',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.seller),
  pushNotificationController.removeToken
);

export const PushNotificationRoutes = router;