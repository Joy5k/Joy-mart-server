import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Category } from "./category.model";
import { ICategory } from "./category.interface";
import QueryBuilder from "../../builder/QueryBuilder";


const createCatergory = async (category:ICategory) => {
    const result = await Category.create(category);
    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create category");
    }
    return result;
}

const getAllCategories = async (query: Record<string, unknown>) => {
      const categorySearchAbleField = [ 'description', 'categoryName', ]; 

  const categoryQuery = new QueryBuilder(
    Category.find(),
    query
  ) .search(categorySearchAbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

     const result = await categoryQuery.modelQuery;
//   const meta = await categoryQuery.countTotal();
  return result
    
  
}
const updateCategory=async(_id:string,payload:ICategory)=>{
    console.log(_id,payload)
    const result=await Category.findByIdAndUpdate(_id,payload,{
        new:true,
    
    })
    return result
}

const getSingleCategory = async (categoryId: string) => {
    const result = await Category.findById(categoryId)
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
    return result;
}

const deleteCategory= async (_id: string) => {
    const result = await Category.deleteOne({_id});
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
    return result;
}

export const categoryServices = {
    createCatergory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}