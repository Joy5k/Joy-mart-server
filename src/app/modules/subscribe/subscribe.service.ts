import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { EmailModel } from "./subscribe.model"

const createUserSubscribeIntoDB=async(email:string)=>{
    const isExists= await EmailModel.findOne({email})
    if(isExists){
        return await EmailModel.findByIdAndUpdate({
            email
    },{
        isSubscribe:true
    })
    }
    const result= await EmailModel.create(email)
    return result
}

const getAllSubscribedUsersFromDB=async()=>{
    const result=await EmailModel.find()
    return result
}
const unsubscribeUserFromDB=async(email:string)=>{
    const isExists=await EmailModel.findOne({email})
    if(!isExists){
        throw new AppError(httpStatus.NOT_FOUND,"user does not exists")
    }
    const result=await EmailModel.findByIdAndUpdate({
            email
    },{
        isSubscribe:false
    })
    return result
}

export const subscibeServices={
    createUserSubscribeIntoDB,
    getAllSubscribedUsersFromDB,
    unsubscribeUserFromDB
}