import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { reviewServices } from "./review.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await reviewServices.createReview(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Review added successfully',
        data: result
    });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await reviewServices.getAllReviews(productId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        data: result
    });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user?._id; // Assuming user is authenticated and attached to request
    const updateData = req.body;
    
    const result = await reviewServices.editReview(userId, reviewId, updateData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review updated successfully',
        data: result
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user?._id; // Assuming user is authenticated and attached to request
    
    const result = await reviewServices.deleteReview(userId, reviewId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review deleted successfully',
        data: result
    });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const result = await reviewServices.getReviewById(reviewId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review retrieved successfully',
        data: result
    });
});
const getAllReviewsAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.getAllReviewsAdmin();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All reviews retrieved successfully',
    data: result
  });
});

const updateReviewStatus = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { status } = req.body;
  
  const result = await reviewServices.updateReviewStatus(reviewId, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review status updated successfully',
    data: result
  });
});
export const reviewController = {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getSingleReview,
    getAllReviewsAdmin,
    updateReviewStatus
};