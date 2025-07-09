import { ObjectId } from "mongoose";

export interface IReportedProduct {
    productId:ObjectId;
    reason: string;
    reportImages?: string[]; 
    description: string;
    reportedBy: ObjectId; 
    status: 'pending' | 'resolved' | 'rejected'; 
    createdAt?: Date; 
    updatedAt?: Date
      adminReply?: {
        message: string;      
        repliedBy: ObjectId;   
        repliedAt?: Date;   
    };
}