import { z } from "zod";

const createProfileValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: "First name is required",
      })
      .optional(),
    lastName: z
      .string({
        required_error: "Last name is required",
      })
      .optional(),
    image: z
      .string({
        required_error: "Image is required",
      })
      .optional(),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, { message: "Password should be at least 6 characters long" }),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    dateOfBirth: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    image: z.string().optional(),
    password: z.string().min(6, { message: "Password should be at least 6 characters long" }).optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    dateOfBirth: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const profileValidation = {
  createProfile: createProfileValidationSchema,
  updateProfile: updateProfileValidationSchema,
};
