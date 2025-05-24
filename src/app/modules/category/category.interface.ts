import { ObjectId } from "mongoose";

export interface ICategory {
  categoryName: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  isDeleted?: boolean;
  isSubCategory?: boolean; // false or undefined means main category
  parentCategoryId?: ObjectId; // Required only for subcategories
}
