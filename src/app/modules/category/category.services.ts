import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Category } from "./category.model";
import { ICategory } from "./category.interface";


const createCatergory = async (category:ICategory) => {
    const result = await Category.create(category);
    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create category");
    }
    return result;
}

const getAllCategories = async () => {
    const result = await Category.find({ isDeleted: false })
        .populate("parentCategoryId")
        .sort({ createdAt: -1 });
    if (!result || result.length === 0) {   
        throw new AppError(httpStatus.NOT_FOUND, "No categories found");
    }
    return result;
}

const getSingleCategory = async (categoryId: string) => {
    const result = await Category.findById(categoryId).populate("parentCategoryId");
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
    return result;
}

const deleteCategory= async (categoryId: string) => {
    const result = await Category.findByIdAndUpdate(categoryId, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
    return result;
}

export const categoryServices = {
    createCatergory,
    getAllCategories,
    getSingleCategory,
    deleteCategory
}