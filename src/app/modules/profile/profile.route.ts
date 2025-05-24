import express, { NextFunction, Response, Request } from "express";
import { profileContainer } from "./profile.controller";
import validateRequest from "../../middlewares/validateRequest";
import { profileValidation } from "./profile.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(profileValidation.createProfile),
  profileContainer.createProfileIntoDB,
);

export const profileRouter = router;
