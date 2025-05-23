import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { ProfileServices } from "./profile.services";
import { IProfile } from "./profile.interface";
import { Request, Response } from "express";


const createProfileIntoDB=async (req: Request, res: Response) => {
    const payload= req.body as IProfile;
    const result = await ProfileServices.createProfile(payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile created successfully!',
        data: result,
      });
}



export const profileContainer = {
    createProfileIntoDB
}

