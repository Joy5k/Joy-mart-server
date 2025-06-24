import { z } from "zod";

// Base review schema
const reviewBaseSchema = z.object({
  productId: z.string({
    required_error: "Product ID is required",
    invalid_type_error: "Product ID must be a string"
  }).min(1, "Product ID cannot be empty"),
  comment: z.string({
    required_error: "Comment is required",
    invalid_type_error: "Comment must be a string"
  })
    .min(10, "Comment must be at least 10 characters long")
    .max(500, "Comment cannot exceed 500 characters")
    .trim(),
  rating: z.number({
    required_error: "Rating is required",
    invalid_type_error: "Rating must be a number"
  })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .default(5)
});

// Create review schema
export const createReviewSchema = z.object({
  body: reviewBaseSchema.extend({
    user: z.string().optional() // Typically set from auth token in controller
  })
});

// Update review schema
export const updateReviewSchema = z.object({
  body: z.object({
    comment: z.string()
      .min(10, "Comment must be at least 10 characters long")
      .max(500, "Comment cannot exceed 500 characters")
      .trim()
      .optional(),
    rating: z.number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .optional()
  }).refine(data => data.comment || data.rating, {
    message: "At least one field (comment or rating) must be provided for update"
  })
});

// Review ID param schema
export const reviewIdSchema = z.object({
  params: z.object({
    reviewId: z.string().min(1, "Review ID is required")
  })
});

// Product ID param schema
export const productIdSchema = z.object({
  params: z.object({
    productId: z.string().min(1, "Product ID is required")
  })
});

// Export all schemas
export const reviewValidation = {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
  productIdSchema
};