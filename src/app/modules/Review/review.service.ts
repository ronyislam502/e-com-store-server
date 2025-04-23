import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TReview } from './review.interface';
import { Review } from './review.model';
import { User } from '../User/user.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createReviewIntoDB = async (payload: TReview) => {
  const isUserExists = await User.findById(payload?.user);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await (await Review.create(payload)).populate('user');
  return result;
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    Review.find().populate('user', 'name email'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await reviewQuery.countTotal();
  const data = await reviewQuery.modelQuery;

  const totalRatings = data?.reduce((sum, review) => sum + review.rating, 0);
  const averageRating =
    data.length > 0 ? (totalRatings / data.length).toFixed(2) : '0.00';

  return {
    meta,
    data,
    averageRating,
  };
};

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
};
