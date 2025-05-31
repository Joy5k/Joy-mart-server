import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { subscribeController } from './subscribe.controller';
import validateRequest from '../../middlewares/validateRequest';
import { subscribeValidation } from './subscribe.validation';

const route=express.Router()

route.get('/',auth(USER_ROLE.admin,USER_ROLE.superAdmin),subscribeController.getAllSubscribers)

route.put('/createUsingToken',validateRequest(subscribeValidation.create),subscribeController.createSubscribeUsingToken)

route.put('/createByEmail',validateRequest(subscribeValidation.create),subscribeController.createSubscribe)

route.delete('/unsubscribe',subscribeController.unsubscribe)

export const SubscribeRoutes=route