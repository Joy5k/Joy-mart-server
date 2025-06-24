import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { subscibeServices } from "./subscribe.service";


const createSubscribeUsingToken=catchAsync(async(req:Request,res:Response)=>{
  const token = req.headers.authorization;
    if(!token){
        throw new AppError(httpStatus.BAD_REQUEST,"you are not authorized")
    }
  const {email}=verifyToken(token,config.jwt_access_secret as string)
  const result=await subscibeServices.createUserSubscribeIntoDB(email)
  sendResponse(res,{
    statusCode:httpStatus.CREATED,
    success:true,
    message:"subcribed successfully",
    data:result
  })

})
const createSubscribe=catchAsync(async(req:Request,res:Response)=>{
    const {email}=req.body
    if(!email){
        throw new AppError(httpStatus.BAD_REQUEST,"Email is required")
    }
    const result=await subscibeServices.createUserSubscribeIntoDB(email)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Subscirbed Successfully",
        data:result
    })
})
const getAllSubscribers=catchAsync(async(req:Request,res:Response)=>{
    const result=await subscibeServices.getAllSubscribedUsersFromDB()
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Subscribers Retrived successfully',
        data:result
    })
})

const unsubscribe=catchAsync(async(req:Request,res:Response)=>{
    const {email}=req.body
    const result= await subscibeServices.unsubscribeUserFromDB(email)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Unsubscribed successfully",
        data:result
    })
})
const unsubscribeUsingToken=catchAsync(async(req:Request,res:Response)=>{
  const token = req.headers.authorization;
    if(!token){
        throw new AppError(httpStatus.BAD_REQUEST,"you are not authorized")
    }
  const {email}=verifyToken(token,config.jwt_access_secret as string)
  const result=await subscibeServices.unsubscribeUserFromDB(email)
  sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"Unsubscribed successfully",
    data:result
  })
})

export const subscribeController={
    createSubscribeUsingToken,
    createSubscribe,
    getAllSubscribers,
    unsubscribe,
    unsubscribeUsingToken
}
