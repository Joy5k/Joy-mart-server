import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";


const reviewSchema=new Schema<IReview>({
    productId:{type:Schema.Types.ObjectId,ref:"ProductModel"},
    user: { type: Schema.Types.ObjectId, ref: "User" },
    comment:{type:String},
    rating:{type:Number,default:5}

},{
    timestamps:true
})

export const ReviewModel=model<IReview>('Reviews',reviewSchema)