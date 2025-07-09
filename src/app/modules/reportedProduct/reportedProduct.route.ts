
import express from 'express';
import auth from '../../middlewares/auth';
import { ReportedProductController } from './reportedProduct.controller';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ReportedProductValidation } from './reportedProduct.validation';

const router = express.Router();

router.post('/create',auth(USER_ROLE.user,USER_ROLE.admin,USER_ROLE.seller,USER_ROLE.superAdmin),validateRequest(ReportedProductValidation.createReportedProductValidation), ReportedProductController.createReportProduct)

router.get('/all-by-admin', auth(USER_ROLE.admin, USER_ROLE.superAdmin), ReportedProductController.getAllReportedProductByAdmin);

router.get('/all-my-reported', auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.seller, USER_ROLE.superAdmin), ReportedProductController.getAllMyReportedProduct);


router.put('/reply/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), ReportedProductController.updateReportedProduct);

router.delete('/delete/:id', auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.seller, USER_ROLE.superAdmin), ReportedProductController.deleteReportedProduct);

router.delete('/delete-by-admin/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), ReportedProductController.deleteReportedProductByAdmin);

export const ReportedProductRoutes = router;