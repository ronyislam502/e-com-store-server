import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { TImageFile } from '../../interface/image';

const createUser = catchAsync(async (req, res) => {
  // if (!req.file) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'please upload image file');
  // }

  const result = await UserServices.createUserIntoDB(
    req.file as TImageFile,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Register Successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.getSingleUsersFromDB(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved Successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserIntoDb(
    id,
    req.file as TImageFile,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User update Successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
