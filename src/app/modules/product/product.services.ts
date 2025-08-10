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

const getAllSellerProducts=async(userId:string,query:Record<string,unknown>) => {
    const productSearchableFields = ['title', 'shortDescription', 'description', ]; 
 
    const productQuery = new QueryBuilder(
      ProductModel.find({
        isActive: true,
        isDeleted: false,
        seller: userId
      }).populate('category'),
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
}

const getAllProducts = async (query: Record<string, unknown>) => {
  const productSearchableFields = ['title', 'shortDescription', 'description', ]; 
 
  const productQuery = new QueryBuilder(
    ProductModel.find({
    isActive: true,
    isDeleted: false
  }).populate('category'),
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

const getAllProductsForAdmin = async (
  query: Record<string, unknown>,
  role: 'admin' | 'superAdmin'|'seller',
  sellerId:string
) => {
  const productSearchableFields = ['title', 'shortDescription', 'description'];
  
  // Base query with common population
  let baseQuery = ProductModel.find().populate('category');

  // Apply role-based filtering
  if (role === 'admin') {
    baseQuery = baseQuery.where('isDeleted').equals(false);
  } 
  if( role==='seller'){
    baseQuery=baseQuery.where('seller').equals(sellerId).where('isDeleted').equals(false).where('isActive').equals(true)
  }
  // superAdmin gets all products (no additional filter)

  const productQuery = new QueryBuilder(
    baseQuery,
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

const deleteProduct=async(_id:string,role:'seller'|'admin'|'superAdmin')=>{
  if(role==='admin'||'seller'){
    //soft delete product by seller and admin
      const result= await ProductModel.findByIdAndUpdate(_id,{isDeleted:true,isActive:false},{new:true,runValidators:true})
    return result

  } else if(role==='superAdmin'){
    //permanent delete prodcut by super admin
 const result = await ProductModel.findByIdAndDelete(_id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Something went wrong");
    }
    return result;
  }
   
}


export const productServices = {
    createProduct,
    updateProduct,
    
    deleteProduct,
    getProductById,
    getAllProducts,
    getAllProductsForAdmin,
    getAllSellerProducts
}