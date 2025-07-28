import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "./auth.utils";
import AppError from "../../errors/AppError";

const cookieOptions: import("express").CookieOptions = {
  secure: config.NODE_ENV === "production",
  httpOnly:false,
  sameSite: "none" as "none",
  path: "/",
  
};
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = (await AuthServices.registerUserIntoDB(req.body)) as {
    refreshToken: string;
    accessToken: string;
    needsPasswordChange: boolean;
  };
  const { refreshToken, accessToken, needsPasswordChange } = result;
  // set refresh token in cookie
res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });
  
  res.cookie("authToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is Registered successfully!",
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000, 
  });
  
  res.cookie("authToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully!",
    data: result
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
    const token = req.cookies?.authToken; 
    const userData=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
    
  const result = await AuthServices.changePassword(userData, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password is updated successfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  res.cookie("authToken", result.accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved successfully!",
    data: result,
  });
});
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const result = await AuthServices.forgetPassword(userEmail);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "reset link is generated  successfully!",
    data: result,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.body.token;
  if(!token){
    throw new AppError(httpStatus.UNAUTHORIZED,"Token is required for reset password")
  }
  const result = await AuthServices.resetPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

const loginWithSocial = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginWithSocial({
    ...req.body,
    ipAddress: req.ip // Capture IP address for security
  });

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });
  
  res.cookie("authToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Social login successful!",
    data: result
  });
});

const logoutUser=catchAsync(async (req: Request, res: Response) => {
 
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("authToken", cookieOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logout successfully",
    data: null,
  });
})

export const AuthControllers = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  loginWithSocial,
  logoutUser
};
