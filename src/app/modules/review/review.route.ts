import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./route.vaidation";

const router = express.Router();

// Create a new review
router.post(
  '/',
  auth(USER_ROLE.user), // Only regular users can create reviews
  validateRequest(reviewValidation.createReviewSchema),
  reviewController.createReview
);

// Get all reviews for a specific product
router.get(
  '/product/:productId',
  reviewController.getAllReviews
);

// Get a single review by ID
router.get(
  '/:reviewId',
  reviewController.getSingleReview
);

// Update a review
router.patch(
  '/:reviewId',
  auth(USER_ROLE.user), // Only review owner can update
  validateRequest(reviewValidation.updateReviewSchema),
  reviewController.updateReview
);

// Delete a review
router.delete(
  '/:reviewId',
  auth(USER_ROLE.user, USER_ROLE.admin), // Owner or admin can delete
  reviewController.deleteReview
);

// Admin routes
router.get(
  '/admin/all-reviews',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  reviewController.getAllReviewsAdmin
);

router.patch(
  '/admin/:reviewId/status',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(reviewValidation.updateReviewSchema),
  reviewController.updateReviewStatus
);

export const reviewRoutes = router;