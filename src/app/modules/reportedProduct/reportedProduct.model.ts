import { model, Schema } from "mongoose";
import { IReportedProduct } from "./reportedProduct.interface";

const reportedProductSchema = new Schema<IReportedProduct>({
    productId: { type:  Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    reportImages: [{ type: String }],
    description: { type: String, required: true },
    reportedBy: { type:  Schema.Types.ObjectId, required: true }, 
    status: { 
        type: String, 
        enum: ['pending', 'resolved', 'rejected'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    adminReply: {
        message: { type: String  },
        repliedBy: { type:  Schema.Types.ObjectId}, 
        repliedAt: { type: Date, default: Date.now } 
    }
}, { 
    timestamps: true 
});

export const ReportProduct = model<IReportedProduct>("ReportedProduct", reportedProductSchema);