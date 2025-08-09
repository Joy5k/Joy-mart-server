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
    const profile = await ProfileModel.findOne({ email });
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
    //  Find the profile with session
    const profile = await ProfileModel.findOne({ email }).session(session);
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    //  Find the associated user
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    //  Check if either is deleted
    if (user.isDeleted || profile.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This profile is already deleted");
    }

    // Prepare updates for both profile and user
    const profileUpdate = { ...payload };
    const userUpdate: Partial<{ email: string }> = {};
    
    // Only update user email if it's different and provided in payload
    if (payload.email && payload.email !== user.email) {
      userUpdate.email = payload.email;
    }

    //  Execute updates in parallel for better performance
     await Promise.all([
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
        : Promise.resolve(null) 
    ]);


    //  Fetch updated profile
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

const becomeSellerOrUser = async (email: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    // Find user with session
    const userProfile = await ProfileModel.findOne({ email }).session(session);
    if (!userProfile) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found on profile");
    }
    
    const existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found on user model");
    }
    
    // Determine new role
    const newRole = existingUser.role === "user" ? "seller" : "user";
    
    // Update both models
    await User.updateOne(
      { email },
      { $set: { role: newRole } },
      { session }
    );
    
    await ProfileModel.updateOne(
      { email },
      { $set: { role: newRole } },
      { session }
    );
    
    await session.commitTransaction();
    
    // Return only the necessary data
    return {
      success: true,
      message: `Role updated to ${newRole}`,
      newRole,
      email
    };
    
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Failed to update user role:", error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR, 
      error.message || "Failed to update user role"
    );
  } finally {
    await session.endSession();
  }
}

const softDeleteProfile = async (email: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const profile = await ProfileModel.findOne({ email }).session(session);
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }

    const userModel = await User.findOne({ email: profile.email })
      .session(session);
    
    if (!userModel) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (userModel.isDeleted || profile.isDeleted) {
      throw new AppError(httpStatus.CONFLICT, "Profile already deleted");
    }

    // Method 1: Using direct update (recommended)
    await User.updateOne(
      { _id: userModel._id },
      { $set: { isDeleted: true } },
      { session }
    );

    await ProfileModel.updateOne(
      { _id: profile._id },
      { $set: { isDeleted: true } },
      { session }
    );

    await session.commitTransaction();
    return { success: true, profile };
  } catch (error: any) {
    await session.abortTransaction();
    
    // Log the actual error for debugging
    console.error('Detailed error:', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to soft delete profile"
    );
  } finally {
    await session.endSession();
  }
};

export const ProfileServices = {
  createProfile,
  getAlluser,
  getMe,
  updateProfile,
  becomeSellerOrUser,
  softDeleteProfile
};
