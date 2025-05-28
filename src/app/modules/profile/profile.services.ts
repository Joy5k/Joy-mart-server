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

const getAlluser =async () => {
  try {
    const profiles = await ProfileModel.find({});
    if (!profiles || profiles.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, "No profiles found");
    }
    return profiles;
  } catch (error: any) {
    console.error("Failed to get profiles:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get profiles");
  }
}


const getMe = async (email: string) => {
  try {
    const profile = await ProfileModel.findOne({ email: email });
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return profile;
  } catch (error: any) {
    console.error("Failed to get profile:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get profile");
  }
};



const updateProfile = async (email: string, payload: Partial<IProfile>) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 1. Find the profile with session
    const profile = await ProfileModel.findOne({ email }).session(session);
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }

    // 2. Find the associated user
    const user = await User.findOne({ email: profile.email }).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // 3. Check if either is deleted
    if (user.isDeleted || profile.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This profile is already deleted");
    }

    // 4. Prepare updates for both profile and user
    const profileUpdate = { ...payload };
    const userUpdate: Partial<{ email: string }> = {};
    
    // Only update user email if it's different and provided in payload
    if (payload.email && payload.email !== user.email) {
      userUpdate.email = payload.email;
    }

    // 5. Execute updates in parallel for better performance
    const [profileUpdateResult, userUpdateResult] = await Promise.all([
      ProfileModel.updateOne(
        { email: email }, 
        { $set: profileUpdate }, 
        { session }
      ),
      Object.keys(userUpdate).length > 0 
        ? User.updateOne(
            { email: user.email },  // Better to use _id for updates
            { $set: userUpdate }, 
            { session }
          )
        : Promise.resolve(null)  // Skip if no user updates needed
    ]);

    // 6. Verify updates were successful
    if (profileUpdateResult.modifiedCount === 0 && (!userUpdateResult || userUpdateResult.modifiedCount === 0)) {
      throw new AppError(httpStatus.NOT_MODIFIED, "No changes were made");
    }

    // 7. Fetch updated profile
    const updatedProfile = await ProfileModel.findOne({ email }).session(session);
    if (!updatedProfile) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch updated profile");
    }

    await session.commitTransaction();
    return updatedProfile;
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Failed to update profile:", error);
    
    // Handle duplicate email error specifically
    if (error.code === 11000 || error.message.includes('duplicate key')) {
      throw new AppError(httpStatus.CONFLICT, "Email already in use");
    }
    
    // If error is already an AppError, rethrow it
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR, 
      error.message || "Failed to update profile"
    );
  } finally {
    await session.endSession();
  }
};

const softDeleteProfile = async (profileId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const profile = await ProfileModel.findById(profileId).session(session);
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    const userModel= await User.findOne({ email: profile.email }).session(session);
    if (!userModel) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if( userModel.isDeleted || profile.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This profile is already deleted");
    }
    userModel.isDeleted = true;
    profile.isDeleted = true;
    await userModel.save({ session });
    await profile.save({ session });

    await session.commitTransaction();
    await session.endSession();
    return profile;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    console.error("Failed to soft delete profile:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to soft delete profile");
  }
};

export const ProfileServices = {
  createProfile,
  getAlluser,
  getMe,
  updateProfile,
  softDeleteProfile
};
