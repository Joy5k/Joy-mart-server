import express, { NextFunction, Response, Request } from "express";
import { profileContainer } from "./profile.controller";
import validateRequest from "../../middlewares/validateRequest";
import { profileValidation } from "./profile.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/create",
  validateRequest(profileValidation.createProfile),
  profileContainer.createProfileIntoDB,
);
router.get(
  "/all",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  profileContainer.getAllusers,
);
router.get(
  "/me",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.seller),
  profileContainer.getMe,
);
router.put(
  "/",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.seller),
  validateRequest(profileValidation.updateProfile),
  profileContainer.updateProfile,
);
router.delete(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.seller),
  profileContainer.softDeleteProfile,
);
export const profileRouter = router;
