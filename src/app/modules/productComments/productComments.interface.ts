import { ObjectId } from "mongoose";

export interface IProductComment {
    productId: ObjectId;
    userId: ObjectId;
    userName: string;
    email: string;
    rating: number; 
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}