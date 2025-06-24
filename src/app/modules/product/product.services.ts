import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ProductModel } from "./product.model";
import { IProduct } from "./product.interface";
import QueryBuilder from "../../builder/QueryBuilder";


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
const getAllProducts = async (query: Record<string, unknown>) => {
  const productSearchableFields = ['title', 'shortDescription', 'description', ]; 

  const productQuery = new QueryBuilder(
    ProductModel.find().populate('category'),
    query
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return {
    meta,
    result
  };
};


const updateProduct=async (_id:string,productData:IProduct) => {
    const result = await ProductModel.findByIdAndUpdate(_id, productData, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    return result;
}
const deleteProduct=async (_id:string) => {
    const result = await ProductModel.findByIdAndDelete(_id);
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