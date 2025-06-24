import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidationSchema } from './category.validation';
import { categoryController } from './category.controller';


const router=express.Router();

router.post('/create',auth(USER_ROLE.admin,USER_ROLE.superAdmin),validateRequest(categoryValidationSchema.create),categoryController.createCategoryIntoDB)

router.get('/',auth(USER_ROLE.admin,USER_ROLE.superAdmin,USER_ROLE.seller,USER_ROLE.user),categoryController.getAllCategoriesFromDB)

router.get('/get/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin),validateRequest(categoryValidationSchema.create),categoryController.getSingleCategoryFromDB)
router.put('/update/:id',auth(USER_ROLE.superAdmin,USER_ROLE.admin),validateRequest(categoryValidationSchema.update),categoryController.updateCategroyIntoDB)
router.delete('/delete/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin),categoryController.deleteCategoryFromDB)


export const CategoryRoutes = router;