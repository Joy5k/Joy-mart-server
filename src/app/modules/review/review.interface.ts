import { ObjectId } from "mongoose";

export interface IReview{
            productId:ObjectId;
            user: ObjectId;
            rating: number;
            comment: string;
            date: string;
}