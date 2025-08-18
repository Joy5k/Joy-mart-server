import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { ProfileServices } from "./profile.services";
import { IProfile } from "./profile.interface";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

const createProfileIntoDB = async (req: Request, res: Response) => {
  const payload = req.body as IProfile;
  const result = await ProfileServices.createProfile(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile created successfully!",
    data: result,
  });
};

const getAllusers=catchAsync(async (req: Request, res: Response) => {
  const result = await ProfileServices.getAlluser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users retrieved successfully!",
    data: result,
  });
})



const getMe = catchAsync(async (req, res) => {

let token = req.cookies?.authToken; 
const authToken=req.params.token
if(!token){
  token=authToken ? authToken :req.user 
}
  const {email,role}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload; 
  const result = await ProfileServices.getMe(email, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user retrieve successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies?.authToken; 
    const {email}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
  const payload = req.body as Partial<IProfile>;
  const result = await ProfileServices.updateProfile(email, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});

const becomeSellerOrUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.authToken;
  const { email } = verifyToken(token, config.jwt_access_secret as string);
  const result = await ProfileServices.becomeSellerOrUser(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully!",
    data: result,
  });
});

const softDeleteProfile= catchAsync(async (req: Request, res: Response) => {
   const token= req.cookies?.authToken;
  const {email}=verifyToken(token,config.jwt_access_secret as string);
  const result = await ProfileServices.softDeleteProfile(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile soft deleted successfully!",
    data: result,
  });
});

export const profileContainer = {
  createProfileIntoDB,
  getAllusers,
  getMe,
  updateProfile,
  becomeSellerOrUser,
  softDeleteProfile
};
