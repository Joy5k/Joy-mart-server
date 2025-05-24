import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productServices } from "./product.services";
import { Request, Response } from "express";

const createProductIntoDB=catchAsync(async (req:Request, res:Response) => {
  const productData = req.body;

  const result = await productServices.createProduct(productData);
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
const deleteProductFromDB=catchAsync(async (req:Request, res:Response) => {
  const { productId } = req.params;

  const result = await productServices.deleteProduct(productId);
  sendResponse(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: "Product deleted successfully",
    data: result,
  });
}
);

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

export const ProductController = {
  createProductIntoDB,
  updateProductInDB,
  deleteProductFromDB,
  getProductById,
  getAllProducts,
};