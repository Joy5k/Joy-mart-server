import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productServices } from "./product.services";
import { Request, Response } from "express";
import { verifyToken } from "../Auth/auth.utils";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

const createProductIntoDB=catchAsync(async (req:Request, res:Response) => {
    let token = req.cookies?.authToken; 
    const headersToken=req.headers.authorization as string
if(!token && headersToken){
  token=headersToken
}
    const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload; 
    const productData = req.body;

  const result = await productServices.createProduct({...productData,seller:userId});
  sendResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully",
    data: result,
  })
}
);



const updateProductInDB=catchAsync(async (req:Request, res:Response) => {
  const { productId } = req.params;
  const productData = req.body;

  const result = await productServices.updateProduct(productId, productData);
  sendResponse(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully",
    data: result,
  });
}
);


const restoreProductFromDB=catchAsync(async(req:Request,res:Response)=>{
  const {id}=req.body;
  const result= await productServices.restoreProduct(id)
  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Product Restored successfully",
    data:result
  })
})

const deleteProductFromDB=catchAsync(async(req:Request,res:Response)=>{
        let token = req.cookies?.authToken; 
    const headersToken=req.headers.authorization as string
if(!token && headersToken){
  token=headersToken
}
    const {role}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload; 
  const { productId } = req.params;

  const result = await productServices.deleteProduct(productId,role);
  sendResponse(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: "Product soft deleted successfully",
    data: result,
  });
})


const getProductById=catchAsync(async (req:Request, res:Response) => {
  const { productId } = req.params;

  const result = await productServices.getProductById(productId);
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Product fetched successfully",
        data: result,
    });
}
);

const getAllProducts=catchAsync(async (req:Request, res:Response) => {
  
  const filters = req.query;

  const result = await productServices.getAllProducts(filters);
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Products fetched successfully",
        data: result,
    });
}
);

const getAllSellerProducts=catchAsync(async (req:Request, res:Response) => {
   const token = req.cookies?.authToken; 
    const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload; 
  const filters = req.query;

  const result = await productServices.getAllSellerProducts(userId,filters);
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Products fetched successfully",
        data: result,
    });
}
);
const getAllProductsForAdmin=catchAsync(async (req:Request, res:Response) => {
    let token = req.cookies?.authToken; 
    const headersToken=req.headers.authorization as string
if(!token && headersToken){
  token=headersToken
}
    const {role,userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload; 
  const filters = req.query;

  const result = await productServices.getAllProductsForAdmin(filters,role,userId);
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Products fetched successfully",
        data: result,
    });
}

);
export const ProductController = {
  createProductIntoDB,
  updateProductInDB,
  deleteProductFromDB,
  getProductById,
  restoreProductFromDB,
  getAllProducts,
  getAllProductsForAdmin,
  getAllSellerProducts
};