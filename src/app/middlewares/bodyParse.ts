import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

export const parseBody = catchAsync(async (req, res, next) => {
  if (!req?.body?.data) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Please provide data in the body under data key',
    );
  }
  req.body = JSON.parse(req?.body?.data);

  next();
});
