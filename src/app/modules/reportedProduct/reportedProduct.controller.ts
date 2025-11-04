import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReportedProductServices } from "./reportedProduct.services";
import httpStatus from "http-status";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";


const createReportProduct=catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const authToken=req.cookies?.authToken; 
    const {userId}=verifyToken(authToken, config.jwt_access_secret as string) as { userId: string };
    const result= await ReportedProductServices.createReportProduct({...payload, reportedBy:userId});
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Product reported successfully",
        data:result
    })
})

const getAllMyReportedProduct=catchAsync(async (req: Request, res: Response) => {
      let token = req.cookies?.authToken; 
   
   const headersToken=req.headers.authorization as string
if(!token && headersToken){
  token=headersToken
}
    const {userId}=verifyToken(token, config.jwt_access_secret as string) as { userId: string };
    const result = await ReportedProductServices.getAllMyReportedProduct(userId, req.query);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Reported products fetched successfully",
        data:result
    })
})

const getAllReportedProductByAdmin=catchAsync(async (req: Request, res: Response) => {
    
    const result = await ReportedProductServices.getAllReportedProductByAdmin(req.query);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Reported products fetched successfully",
        data:result
    })
})

const updateReportedProduct=catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ReportedProductServices.updateReportedProduct(id, req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Reported product updated successfully",
        data:result
    })
})

const deleteReportedProduct=catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authToken=req.cookies?.authToken; 
    const {userId}=verifyToken(authToken, config.jwt_access_secret as string) as { userId: string };
    const result = await ReportedProductServices.deleteReportedProduct(id, userId);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Reported product deleted successfully",
        data:result
    })
})

const deleteReportedProductByAdmin=catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ReportedProductServices.deleteReportedProductByAdmin(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Reported product deleted successfully",
        data:result
    })
})

export const ReportedProductController = {
    createReportProduct,
    updateReportedProduct,
    getAllReportedProductByAdmin,
    getAllMyReportedProduct,
    deleteReportedProduct,
    deleteReportedProductByAdmin
}