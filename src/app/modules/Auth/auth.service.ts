import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config/index";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser, TRegisterUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";
import { USER_ROLE } from "../user/user.constant";
import { ProfileModel } from "../profile/profile.model";
import mongoose from "mongoose";

const registerUserIntoDB = async (payload: TRegisterUser) => {
  const session = await mongoose.startSession();
  try {
     session.startTransaction();

    // Check if user exists in either collection
    const [isUserExists, isUserExistsOnProfile] = await Promise.all([
      User.findOne({ email: payload.email }).session(session),
      ProfileModel.findOne({ email: payload.email }).session(session)
    ]);

    if (isUserExists || isUserExistsOnProfile) {
      throw new AppError(httpStatus.CONFLICT, `${payload.email} already exists`);
    }

    // Create profile 
    const profileResult = await ProfileModel.create([payload], { session });
    if (!profileResult.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create profile");
    }

    //  create user
    const userResult = await User.create([payload], { session });
    if (!userResult.length || !userResult[0]._id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    const user = userResult[0];
    const jwtPayload = {
      userId: user._id,
      role: USER_ROLE.user,
      email: user.email,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    await session.commitTransaction();
    
    return {
      accessToken,
      refreshToken,
      needsPasswordChange: true,
    };
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    await session.endSession();
  }
};
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user?._id) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked or deleted ! Please try another email");
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //create token and sent to the  client
  const jwtPayload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: any,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userData?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }




  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))){
        throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

   await User.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { iat, email } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  try {
    const user = await User.isUserExistsByEmail(email);
    const profile = await ProfileModel.findOne({email});
    
    if (!user || !profile) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }

    if (user?.isDeleted || profile?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    if (user?.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    const jwtPayload = {
      userId: user._id,
      role: user.role,
      email: user.email,
    };

    const resetToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      "10m",
    );

    const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken}`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
            color: #1a202c;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 30px 0;
        }
        
        .logo {
            max-width: 150px;
        }
        
        .card {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }
        
        .card-header {
            background: linear-gradient(135deg, #088178 0%, #077168 100%);
            padding: 25px;
            text-align: center;
            color: white;
        }
        
        .card-body {
            padding: 30px;
        }
        
        h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        h2 {
            color: #2d3748;
            font-size: 20px;
            margin-top: 0;
        }
        
        p {
            font-size: 15px;
            line-height: 1.6;
            color: #4a5568;
        }
        
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #088178 0%, #077168 100%);
            color: white !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 30px;
            font-weight: 500;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 15px rgba(8, 129, 120, 0.3);
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(8, 129, 120, 0.4);
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #718096;
        }
        
        .expiry-note {
            background-color: #fffaf0;
            border-left: 4px solid #f6ad55;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
        }
        
        .social-links {
            text-align: center;
            margin: 25px 0;
        }
        
        .social-icon {
            display: inline-block;
            margin: 0 10px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #edf2f7;
            text-align: center;
            line-height: 36px;
            color: #4a5568;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background-color: #088178;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://i.ibb.co/KddsJ56/logo.png" alt="Company Logo" class="logo">
        </div>
        
        <div class="card">
            <div class="card-header">
                <h1>Password Reset Request</h1>
            </div>
            
            <div class="card-body">
                <h2>Hello there!</h2>
                
                <p>We received a request to reset your password. Click the button below to set a new password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUILink}" class="btn">Reset Password</a>
                </div>
                
                <div class="expiry-note">
                    <strong>Note:</strong> This link will expire in 10 minutes for security reasons.
                </div>
                
                <p>If you didn't request this password reset, please ignore this email or contact support if you have questions.</p>
                
                <p>Best regards,<br>Joy-Mart</p>
                
                <div class="social-links">
                    <a href="#" class="social-icon">Facebook</a>
                 
                    <a href="https://www.linkedin.com/in/eng-mehedi-hasan-joy/" class="social-icon">LinkdOn</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Joy-Mart. All rights reserved.</p>
            <p>Patuakhali, Barisal, Bangladesh</p>
            <p>
                <a href="#" style="color: #718096; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #718096; text-decoration: none;">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

    await sendEmail(user.email, html);
    
  } catch (error) {
    console.error("Forget password error:", error);
    throw error;
  }
};

const resetPassword = async (
  payload: { email: string; newPassword: string; _id: string },
  token: string,
) => {
  const session= await mongoose.startSession()

  const user = await User.isUserExistsByEmail(payload?.email);
  const profile= await ProfileModel.findOne({email:payload?.email})

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted || profile?.isDeleted;


  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  if (payload._id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Your are forbidden");
  }
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  try {
    session.startTransaction()
     await User.findOneAndUpdate(
    {
      _id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    {session}
  );
  await ProfileModel.findOneAndUpdate({
    email:payload.email,
    role:payload.email
  },{
      password: newHashedPassword,
      passwordChangedAt: new Date(),
  }
  ,{session})
  session.commitTransaction()
  session.endSession()
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,"Failed to reset password")
    session.abortTransaction()
    session.endSession()
  }
 
};

// Logout user and remove authToken and refreshToken from cookies
const logoutUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  return { message: "User logged out successfully" };
};

export const AuthServices = {
  registerUserIntoDB,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
