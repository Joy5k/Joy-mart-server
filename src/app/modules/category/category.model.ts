import mongoose, { Schema, model } from "mongoose";
import { ICategory } from "./category.interface";


const categorySchema = new Schema<ICategory>(
  {
    categoryName: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isSubCategory: { type: Boolean, default: false },
    parentCategoryId: { type: Schema.Types.ObjectId, ref: "Category", required: false },
  },
  { timestamps: true } 
);

export const Category = model<ICategory>("Category", categorySchema);

