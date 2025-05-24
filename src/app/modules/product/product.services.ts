import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ProductModel } from "./product.model";
import { IProduct } from "./product.interface";


const createProduct=async (productData:IProduct) => {
    const result=  await ProductModel.create(productData);
    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST,"Failed to create product");
    }
    return result;
}
const getProductById=async (productId:string) => {
    const result = await ProductModel.findById(productId);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    return result;
}
const getAllProducts=async (filters:any) => {
    const { searchTerm, ...filterData } = filters;
    const query: any = { ...filterData };
    if (searchTerm) {
        query.$or = [
            { title: { $regex: searchTerm, $options: "i" } },
            { shortTitle: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
            { shortDescription: { $regex: searchTerm, $options: "i" } },
            { category: { $regex: searchTerm, $options: "i" } },
            { subCategory: { $regex: searchTerm, $options: "i" } },
            { tags: { $regex: searchTerm, $options: "i" } },
        ];
    }
    const result = await ProductModel.find(query)
        .populate("category", "name")
        .populate("subCategory", "name")
        .populate("tags", "name")
        .sort({ createdAt: -1 });
    if (!result || result.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No products found");
    }
    return result;
}


const updateProduct=async (productId:string,productData:IProduct) => {
    const result = await ProductModel.findByIdAndUpdate(productId, productData, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    return result;
}
const deleteProduct=async (productId:string) => {
    const result = await ProductModel.findByIdAndDelete(productId);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    return result;
}

export const productServices = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProducts
}