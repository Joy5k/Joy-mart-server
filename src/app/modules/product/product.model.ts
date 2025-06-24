import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productModelSchema = new Schema({
  title: { type: String, required: true },
  shortTitle: { type: String, default: "Product Name" },
  description: { type: String, required: true },
  shortDescription: { type: String, default: "There have not any product description. " },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  discountPercentage: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  lowStockThreshold: { type: Number, default: 5 },
  weight: { type: Number, default: 0 },
  dimensions: {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  images: [{ type: String }],
  thumbnail: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  attributes: { type: Object },
  featured: { type: Boolean, default: false },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  shipping: {
    free: { type: Boolean, default: false },
    processingTime: { type: String, default: "1-2 business days" },
  },
  isActive:{type:Boolean,default:true}
});


export const ProductModel = model<IProduct>("Product", productModelSchema);