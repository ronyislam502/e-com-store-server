import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interface/image';
import { Category } from '../Category/category.model';
import { productSearchableFields } from './product.const';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createProductIntoDB = async (images: TImageFiles, payload: TProduct) => {
  const { files } = images;
  payload.images = files?.map((file) => file.path);

  const category = await Category.findById(payload?.category);

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const deleteCategory = category?.isDeleted;

  if (deleteCategory) {
    throw new AppError(httpStatus.FORBIDDEN, 'Category was deleted');
  }

  if (payload?.quantity === 0) {
    payload.isStock = false;
  }

  const result = await (await Product.create(payload)).populate('category');

  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find().populate('category'),
    query,
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productQuery.countTotal();
  const data = await productQuery.modelQuery;

  return {
    meta,
    data,
  };
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id).populate('category');
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateProductFromDB = async (
  id: string,
  images: TImageFiles,
  payload: Partial<TProduct>,
) => {
  const { files } = images;
  payload.images = files?.map((file) => file.path);

  if (typeof payload.quantity === 'number') {
    payload.isStock = payload.quantity > 0;
  }

  const result = await Product.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getSingleProductFromDB,
  updateProductFromDB,
  deleteProductFromDB,
  getAllProductsFromDB,
};
