import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: "Ffrst name is required." }),
    lastName: z.string({ required_error: "Last name is required." }),
    email: z.string({ required_error: "Email is required." }),
    password: z.string({ required_error: "Password is required" }),
  }),
});
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required." }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "User email is required!",
    }),
  }),
});
const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "email id is required!",
    }),
    newPassword: z.string({
      required_error: "User password is required!",
    }),
  }),
});
const socialLoginValidationSchema = z.object({
  body: z.object({
    provider: z.enum(['google', 'facebook', 'apple'], {
      required_error: "Provider is required and must be either 'google', 'facebook' or 'apple'",
    }),
    token: z.string({
      required_error: "Social token is required",
    }),
    deviceId: z.string().optional(),
  }),
});


export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  socialLoginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
