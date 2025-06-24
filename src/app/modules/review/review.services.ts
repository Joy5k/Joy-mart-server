import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IReview } from "./review.interface";
import { ReviewModel } from "./review.model";
import mongoose from "mongoose";

const createReview = async (payload: IReview) => {

    return await ReviewModel.create(payload);
};

const getAllReviews = async (productId: string) => {
    return await ReviewModel.find({ product: productId })
        .populate('user', 'name email') // Include user details
        .sort({ createdAt: -1 }); // Sort by newest first
};

const getReviewById = async (reviewId: string) => {
    const review = await ReviewModel.findById(reviewId).populate('user', 'name email');
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }
    return review;
};

const deleteReview = async (userId: string, reviewId: string) => {
    try {
        // Validate input parameters
        if (!userId || !reviewId) {
            throw new AppError(httpStatus.BAD_REQUEST, "User ID and Review ID are required");
        }

        // Check if the review exists
        const review = await ReviewModel.findById(reviewId);
        if (!review) {
            throw new AppError(httpStatus.NOT_FOUND, "Review not found");
        }

        // Verify the user owns the review
        if (review.user.toString() !== userId) {
            throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own reviews");
        }

        // Delete the review
        const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);
        
        if (!deletedReview) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete review");
        }

        return deletedReview;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error deleting review");
    }
};

const editReview = async (userId: string, reviewId: string, updateData: Partial<IReview>) => {
    try {
        // Validate input parameters
        if (!userId || !reviewId) {
            throw new AppError(httpStatus.BAD_REQUEST, "User ID and Review ID are required");
        }

        // Check if at least one field to update is provided
        if (!updateData.rating && !updateData.comment) {
            throw new AppError(httpStatus.BAD_REQUEST, "At least one field (rating or comment) must be provided");
        }

        // Validate rating range if provided
        if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
            throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }

        // Find the review
        const review = await ReviewModel.findById(reviewId);
        if (!review) {
            throw new AppError(httpStatus.NOT_FOUND, "Review not found");
        }

        // Verify the user owns the review
        if (review.user.toString() !== userId) {
            throw new AppError(httpStatus.FORBIDDEN, "You can only edit your own reviews");
        }

        // Prepare the update
        const updatePayload: Partial<IReview> = {
            ...updateData,
        };

        // Update the review
        const updatedReview = await ReviewModel.findByIdAndUpdate(
            reviewId,
            updatePayload,
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update review");
        }

        return updatedReview;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid Review ID format");
        }
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating review");
    }
};


const getAllReviewsAdmin = async () => {
  return await ReviewModel.find()
    .populate('user', 'name email')
    .populate('product', 'name')
    .sort({ createdAt: -1 });
};

const updateReviewStatus = async (reviewId: string, status: string) => {
  const review = await ReviewModel.findByIdAndUpdate(
    reviewId,
    { status },
    { new: true, runValidators: true }
  );
  
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  return review;
};
export const reviewServices = {
    createReview,
    getAllReviews,
    getReviewById,
    deleteReview,
    editReview,
    getAllReviewsAdmin,
    updateReviewStatus
};