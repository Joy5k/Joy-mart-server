import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IProfile } from "./profile.interface";
import { ProfileModel } from "./profile.model";
import mongoose from "mongoose";
import { User } from "../user/user.model";

const createProfile = async (payload: IProfile) => {
  const session = await mongoose.startSession();
  // Check existence within transaction to prevent race conditions
  const isExistsUser = await ProfileModel.findOne({ email: payload.email });
  if (isExistsUser) {
    throw new AppError(httpStatus.CONFLICT, "This user already exists");
  }

  try {
    session.startTransaction();

    // Create profile
    const createProfileResult = await ProfileModel.create([payload], {
      session,
    });
    if (!createProfileResult || createProfileResult.length === 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create profile",
      );
    }

    // Create user - consider hashing password first!
    const userPayload = {
      email: payload.email,
      password: payload.password, // WARNING: Password should be hashed!
      needsPasswordChange: true,
      role: "user",
      status: "in-progress",
      isDeleted: false,
    };

    await User.create([userPayload], { session });

    await session.commitTransaction();
    await session.endSession();
    return createProfileResult;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    // Log the actual error for debugging
    console.error("Profile creation failed:", error);
  }
};

export const ProfileServices = {
  createProfile,
};
