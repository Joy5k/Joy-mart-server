import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.services";
import { Request, Response } from "express";



const createCategoryIntoDB=catchAsync(async (req:Request, res:Response) => {
    const categoryData = req.body;

    const result = await categoryServices.createCatergory(categoryData);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: result,
    });
}   )

const getAllCategoriesFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryServices.getAllCategories(req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories retrieved successfully",
        data: result
    });
});

const getSingleCategoryFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await categoryServices.getSingleCategory(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category retrieved successfully",
        data: result,
    });
});
const updateCategroyIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params
    const payload=req.body
    const result=await categoryServices.updateCategory(id,payload)
    sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"updated category successfully",
    data:result
    })
})
const deleteCategoryFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryServices.deleteCategory(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category deleted successfully",
        data: result,
    });
});


export const categoryController = {
    createCategoryIntoDB,
    getSingleCategoryFromDB,
    deleteCategoryFromDB,
    updateCategroyIntoDB,
    getAllCategoriesFromDB
}