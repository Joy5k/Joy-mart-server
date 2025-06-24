import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { EmailModel } from "./subscribe.model"

const createUserSubscribeIntoDB = async (email: string) => {
  // Check if email already exists
  const isExists = await EmailModel.findOne({ email });
  
  if (isExists) {
    // Update existing subscription
    return await EmailModel.findOneAndUpdate(
      { email }, // filter
      { isSubscribe: true }, // update
      { new: true } // options - return the updated document
    );
  }
  
  // Create new subscription - pass an OBJECT with the email field
  const result = await EmailModel.create({ email });
  return result;
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