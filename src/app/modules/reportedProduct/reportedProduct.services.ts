import { ReportProduct } from "./reportedProduct.model";
import { IReportedProduct } from "./reportedProduct.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

const createReportProduct=async (payload:Partial<IReportedProduct>) => {
    
        const result =await ReportProduct.create(payload)
        console.log(result,payload)
        return result;
    
}

const getAllReportedProductByAdmin=async (query:any) => {
    const queryAbleFields = ["searchTerm", "page", "limit", "sortBy", "sortOrder","status"];
    try {
    const reportQuery = new QueryBuilder(
    ReportProduct.find().populate(['productId', 'reportedBy','adminReply.repliedBy']),
    query
  )
    .search(queryAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reportQuery.modelQuery;
  const meta = await reportQuery.countTotal();
  return {
    meta,
    result
  };
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Error fetching reported products");
    }
}
const getAllMyReportedProduct=async (userId:string,query:any) => {
    const queryAbleFields = ["searchTerm", "page", "limit", "sortBy", "sortOrder","status"];
    try {
    const reportQuery = new QueryBuilder(
    ReportProduct.find({reportedBy: userId}).populate(['productId', 'reportedBy','adminReply.repliedBy']),
    query
  )
    .search(queryAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reportQuery.modelQuery;
  const meta = await reportQuery.countTotal();
  return {
    meta,
    result
  };
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Error fetching reported products");
    }
}
// reply user's reported product by admin or suparAdmin

const updateReportedProduct = async (id: string, reply: any) => {
    try {
        const result = await ReportProduct.findByIdAndUpdate(id, { adminReply: reply }, { new: true });
        return result;
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Error updating reported product");
    }
}

const deleteReportedProduct = async (_id: string, reportedBy:string) => {
    try {
        const isExists= await ReportProduct.findOne({ _id, reportedBy });
        if (!isExists) {
            throw new AppError(httpStatus.NOT_FOUND, "Reported product not found");
        }
        const result=await ReportProduct.findByIdAndDelete({_id, reportedBy});
        return result;
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Error deleting reported product");
    }
}


const deleteReportedProductByAdmin = async (id: string) => {
    try {
        const result = await ReportProduct.findByIdAndDelete(id);
        if (!result) {
            throw new AppError(httpStatus.NOT_FOUND, "Reported product not found");
        }
        return result;
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Error deleting reported product");
    }
}


export const ReportedProductServices = {
    createReportProduct,
    updateReportedProduct,
    getAllReportedProductByAdmin,
    getAllMyReportedProduct,
    deleteReportedProduct,
    deleteReportedProductByAdmin
}