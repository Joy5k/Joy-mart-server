import express, { NextFunction, Response, Request } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createAdminValidationSchema } from "../Admin/admin.validation";
import { USER_ROLE } from "./user.constant";
import { UserControllers } from "./user.controller";
import { UserValidation } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/create",
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.createUser,
);
router.post(
  "/createUserByAdmin",
  UserControllers.createUserByAdmin,
);
router.post(
  "/create-admin",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.get(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.getMe,
);
router.post(
  "/change-status/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.getAllUsers,
);

router.put('/updateByAdmin/:email',auth(USER_ROLE.admin, USER_ROLE.superAdmin),UserControllers.updateUser)

router.delete('/deleteBySuperAdmin',auth(USER_ROLE.superAdmin),UserControllers.deleteUserBySuperAdmin)

export const UserRoutes = router;
