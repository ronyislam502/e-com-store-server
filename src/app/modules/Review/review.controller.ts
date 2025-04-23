import httpStatus from 'http-status';
import { ReviewServices } from './review.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReviewIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review post successfully',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  // const limit = Number(req.query.limit) || 0;
  // const result = await ReviewServices.getAllReviewsFromDB(Number(limit));

  const result = await ReviewServices.getAllReviewsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReviews,
};
