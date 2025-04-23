import httpStatus from 'http-status';
import { ProductServices } from './product.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interface/image';

const createProduct = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(httpStatus.NOT_FOUND, 'please upload image');
  }
  const result = await ProductServices.createProductIntoDB(
    req.files as TImageFiles,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product create successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getSingleProductFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.updateProductFromDB(
    id,
    req.files as TImageFiles,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

const deleteProducts = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProducts,
  getAllProducts,
};
