import { model, Schema } from "mongoose";
import { IEmail } from "./subscribe.interface";

const subscribeSchema = new Schema<IEmail>({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    isSubscribe: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const EmailModel = model<IEmail>('Email', subscribeSchema);