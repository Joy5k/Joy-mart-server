import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IProductComment } from "./productComments.interface";
import { ProductComment } from "./productsComments.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { ProfileModel } from "../profile/profile.model";

const createProductComment = async (commentData: IProductComment) => {
    const userName=await ProfileModel.findOne({email: commentData.email}, {firstName: 1});
    if (!userName) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    try {
        const result = await ProductComment.create({...commentData, userName: userName?.firstName});
        return result;
    } catch (error) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE,"Error creating product comment");
    }
}

const getProductCommentsByProductId = async (productId: string, query: any) => {
    const queryAbleFields = ["searchTerm", "page", "limit", "sortBy", "sortOrder"];
    
    try {
        const commentQuery = new QueryBuilder(
            ProductComment.find({ productId })
                .populate({ path: 'userId', select: 'email' }),
            query
        ) 
    .search(queryAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await commentQuery.modelQuery;
  const meta = await commentQuery.countTotal();
  return {
    meta,
    result
  };
    } catch (error) {
        throw new AppError(httpStatus.NOT_FOUND, "Error fetching product comments");
    }
}

const deleteProductComment = async (commentId: string, userId: string) => {
    const result = await ProductComment.findOneAndDelete({ _id: commentId, userId });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Product comment not found or you are not authorized to delete this comment");
    }
    return result;
}
const updateProductComment = async (commentId: string, userId: string, commentData: Partial<IProductComment>) => {
    const result = await ProductComment.findOneAndUpdate(
        { _id: commentId, userId },
        { $set: commentData },
        { new: true }
    );
    console.log(commentData)
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Product comment not found or you are not authorized to update this comment");
    }
    return result;
}
export const ProductCommentService = {
    createProductComment,
    getProductCommentsByProductId,
    deleteProductComment,
    updateProductComment
};
