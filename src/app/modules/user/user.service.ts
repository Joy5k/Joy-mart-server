/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TAdmin } from "../Admin/admin.interface";
import { Admin } from "../Admin/admin.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import QueryBuilder from "../../builder/QueryBuilder";
import { ProfileModel } from "../profile/profile.model";
import bcrypt from "bcrypt";

const createUserIntoDB = async (file: any, password: string, payload: any) => {
  const session=await mongoose.startSession()
  try {
        session.startTransaction();

    const result=await ProfileModel.create([payload], { session });
    
    if (!result.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    await ProfileModel.create([{ user: result[0]._id }], { session });
    await User.create([{ user: result[0]._id }], { session });
    await session.commitTransaction();
    return result[0];
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
  
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set UserIntoDB,
  userData.role = "admin";
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id

    if (file) {
      const imageName = `${userData._id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = (await sendImageToCloudinary(
        imageName,
        path,
      )) as any;
      payload.profileImg = secure_url;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = new mongoose.Types.ObjectId(newUser[0]._id); //reference _id as ObjectId
    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createUserByAdmin = async (payload: Partial<TUser>) => {
  const { password } = payload;
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }
  const encryptedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const modifyPayload = {
    ...payload,
    password: encryptedPassword
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await User.create([modifyPayload], { session });

    if (!result.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    await ProfileModel.create([modifyPayload], { session });
    await session.commitTransaction();
    return result[0];
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};


const getMe = async (email: string, role: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction()
     const userExists= await User.findOne({ email ,role}).session(session);
    const profileExists=await  ProfileModel.findOne({ email,role }).session(session)
      if (!userExists) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    } 
    if(!profileExists){
            throw new AppError(httpStatus.NOT_FOUND, "Profile not found");

    }
    return profileExists
  } catch (err:any) {
      await session.abortTransaction();
    if (err instanceof AppError) throw err;
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrived user ${email}`, err.message);
  }
 
};


const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const getAllUsers = async (
  query: Record<string, unknown>,
  role: 'admin' | 'superAdmin'
) => {
  const userSearchableFields = ['firstName', 'lastName', 'email', 'role', 'status'];
  
  const baseQuery = User.find(role === 'admin' ? { isDeleted: false } : {});
  
  const userQuery = new QueryBuilder(baseQuery, query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [result, meta] = await Promise.all([
    userQuery.modelQuery,
    userQuery.countTotal()
  ]);

  return { meta, result };
};

const updateUser= async (email: string, payload: Partial<TUser>) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await User.findOneAndUpdate({ email }, payload, {
      new: true,
      session
    });
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    await ProfileModel.findOneAndUpdate({ email: result.email }, { $set: payload }, { new: true, session });
    

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const restoreUser=async(email:string)=>{
   const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userExists= await User.findOne({ email }).session(session);
    const profileExists=await  ProfileModel.findOne({ email }).session(session)
   

    if (!userExists) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    } 
    if(!profileExists){
            throw new AppError(httpStatus.NOT_FOUND, "Profile not found");

    }
    await User.updateOne({email},{isDeleted:false},{new:true,session})
    await ProfileModel.updateOne({email},{isDeleted:false},{new:true,session})

    await session.commitTransaction();
    return { success: true, message: `User ${email} restored successfully` };
  } catch (err: any) {
    await session.abortTransaction();
    if (err instanceof AppError) throw err;
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to restore user ${email}`, err.message);
  } finally {
    session.endSession();
  }
}

const deleteUserBySuperAdmin = async (email: string, role: 'admin' | 'superAdmin') => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userExists= await User.findOne({ email }).session(session);
    const profileExists=await  ProfileModel.findOne({ email }).session(session)
   

    if (!userExists) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    } 
    if(!profileExists){
            throw new AppError(httpStatus.NOT_FOUND, "Profile not found");

    }

    if (role === 'admin') {
      await Promise.all([
        User.updateOne({ email }, { isDeleted: true }, { session }),
        ProfileModel.updateOne({ email }, { isDeleted: true }, { session })
      ]);
    } else {
      await Promise.all([
        User.deleteOne({ email }).session(session),
        ProfileModel.deleteOne({ email }).session(session)
      ]);
    }

    await session.commitTransaction();
    return { success: true, message: `User ${email} ${role === 'admin' ? 'soft-deleted' : 'permanently deleted'} successfully` };
  } catch (err: any) {
    await session.abortTransaction();
    if (err instanceof AppError) throw err;
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to delete user ${email}`, err.message);
  } finally {
    session.endSession();
  }
};


export const UserServices = {
  createUserIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
  getAllUsers,
  updateUser,
  createUserByAdmin,
  deleteUserBySuperAdmin,
  restoreUser
};
