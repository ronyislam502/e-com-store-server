import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const allOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrdersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const userOrders = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await OrderServices.getOrderByEmailFromDB(req.query, email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user Orders retrieved successfully',
    data: result,
  });
});

const getTrendingProducts = catchAsync(async (req, res) => {
  const days = req.query.days ? parseInt(req.query.days as string) : undefined;

  const result = await OrderServices.getTrendingProductsFromDB(days);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'trending',
    data: result,
  });
});

const statisticPayment = catchAsync(async (req, res) => {
  const result = await OrderServices.getProductStatisticsPayment();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'statistic payment',
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  allOrders,
  userOrders,
  getTrendingProducts,
  statisticPayment,
};
