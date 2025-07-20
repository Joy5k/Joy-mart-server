import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { Request, Response } from "express";

const createUser = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createUserIntoDB(
    req.file,
    password,
    studentData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is created successfully",
    data: result,
  });
});

const createUserByAdmin = catchAsync(async (req, res) => {
  
    const result = await UserServices.createUserByAdmin(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User is created successfully",
      data: result,
    });
 

})

const getMe = catchAsync(async (req, res) => {
  // }
  const { userId, role } = req.user; //getting the user data after its verified check the module-19.8 if you have any dought
  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user retrieve successfully",
    data: result,
  });
});
const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.changeStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user retrieve successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const {email}= req.params;
  const result = await UserServices.updateUser(email, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUserBySuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await UserServices.deleteUserBySuperAdmin(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserControllers = {
   createUser,
  createAdmin,
  getMe,
  changeStatus,
  getAllUsers,
  updateUser,
  createUserByAdmin,
  deleteUserBySuperAdmin
};

