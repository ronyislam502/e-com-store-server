import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TImageFile } from '../../interface/image';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (image: TImageFile, payload: TUser) => {
  const file = image;
  payload.profileImg = file?.path;

  const result = await User.create(payload);

  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await userQuery.countTotal();
  const data = await userQuery.modelQuery;

  return {
    meta,
    data,
  };
};

const getSingleUsersFromDB = async (email: string) => {
  const result = await User.find({ email });

  return result;
};

const updateUserIntoDb = async (
  id: string,
  image: TImageFile,
  payload: Partial<TUser>,
) => {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const file = image;
  payload.profileImg = file?.path;

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUsersFromDB,
  updateUserIntoDb,
};
