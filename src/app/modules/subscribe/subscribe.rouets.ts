import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { subscribeController } from './subscribe.controller';
import validateRequest from '../../middlewares/validateRequest';
import { subscribeValidation } from './subscribe.validation';

const route=express.Router()

route.get('/',auth(USER_ROLE.admin,USER_ROLE.superAdmin),subscribeController.getAllSubscribers)

route.post('/createUsingToken',auth(USER_ROLE.user,USER_ROLE.admin,USER_ROLE.seller,USER_ROLE.superAdmin),subscribeController.createSubscribeUsingToken)

route.post('/createByEmail',validateRequest(subscribeValidation.create),subscribeController.createSubscribe)

route.delete('/unsubscribe',subscribeController.unsubscribe)

route.delete ('/unsubscribeUsingToken',auth(USER_ROLE.user,USER_ROLE.admin,USER_ROLE.seller,USER_ROLE.superAdmin),subscribeController.handleSubscribeInToDB)
export const SubscribeRoutes=route