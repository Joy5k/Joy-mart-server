import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ProductCommentService } from "./productComments.services";
import { verifyToken } from "../Auth/auth.utils";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import sendResponse from "../../utils/sendResponse";


const createProductComment=catchAsync(async (req:Request, res:Response) => {
   const token = req.cookies?.authToken; 
     const {userId,email}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
    const commentData = {
        ...req.body,
        userId,
        email
    };
    const result = await ProductCommentService.createProductComment(commentData);
    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Product comment created successfully",
        data: result
    })
});
const getProductCommentsByProductId=catchAsync(async (req:Request, res:Response) => {
    const { productId } = req.params;
    const query = req.query;
    const result = await ProductCommentService.getProductCommentsByProductId(productId, query);
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Product comments fetched successfully",
        data: result
    })
});
const deleteProductComment=catchAsync(async (req:Request, res:Response) => {
    const { commentId } = req.params;
    const token = req.cookies?.authToken; 
    const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
    const result = await ProductCommentService.deleteProductComment(commentId, userId);
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Product comment deleted successfully",
        data: result
    })
});
const updateProductComment=catchAsync(async (req:Request, res:Response) => {
    const { commentId } = req.params;
    const token = req.cookies?.authToken; 
    const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
    const commentData = req.body;
    const result = await ProductCommentService.updateProductComment(commentId, userId, commentData);
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Product comment updated successfully",
        data: result
    })
});
export const ProductCommentController = {
    createProductComment,
    getProductCommentsByProductId,
    deleteProductComment,
    updateProductComment
};