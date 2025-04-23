/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../Product/product.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { User } from '../User/user.model';
import { initiatePayment } from '../Payment/payment.utils';
import { TPayment } from '../Payment/payment.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createOrderIntoDB = async (payload: TOrder) => {
  const { user, products } = payload;

  try {
    const productDetails = [];
    let totalPrice = 0;
    let totalQuantity = 0;

    // Step 1: Validate all products first
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product with ID ${item?.product} not found`,
        );
      }

      if (item.quantity > product.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product ${product.name}. Available: ${product.quantity}`,
        );
      }

      productDetails.push({
        product: product._id,
        quantity: item.quantity,
      });

      totalPrice += parseFloat((product.price * item.quantity).toFixed(2));
      totalQuantity += item.quantity;
    }

    const tax = parseFloat((totalPrice * 0.1).toFixed(2));
    const grandAmount = totalPrice + tax;

    // Step 2: Update product stock only if all validations pass
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      product.quantity -= item.quantity;

      if (product.quantity === 0) {
        product.isStock = false;
      }

      await product.save();
    }

    const transactionId = `TXN-${Date.now()}`;

    // Step 3: Create order
    const order = new Order({
      user,
      products: productDetails,
      totalQuantity,
      tax,
      totalPrice,
      grandAmount,
      status: 'Pending',
      paymentStatus: 'Pending',
      transactionId,
    });

    await order.save();

    const paymentData: TPayment = {
      transactionId,
      user,
      grandAmount,
    };

    const payment = await initiatePayment(paymentData);

    return payment;
  } catch (error: any) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Order creation failed: ${error?.message}`,
    );
  }
};

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    Order.find().populate('user', 'name phone address email'),
    query,
  ).paginate();

  const meta = await orderQuery.countTotal();
  const data = await orderQuery.modelQuery;

  return {
    meta,
    data,
  };
};

const getOrderByEmailFromDB = async (
  query: Record<string, unknown>,
  email: string,
) => {
  const user = await User.find({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  const orderQuery = new QueryBuilder(
    Order.find({ user }).populate('user', 'name phone address email'),
    query,
  ).paginate();

  const meta = await orderQuery.countTotal();
  const data = await orderQuery.modelQuery;

  // const result = await Order.find({ user })
  //   .populate('user', 'name email phone address')
  //   .populate({
  //     path: 'products.product',
  //     populate: {
  //       path: 'category',
  //     },
  //   });
  return {
    meta,
    data,
  };
};

const getTrendingProductsFromDB = async (days?: number) => {
  const matchStage: any = {
    status: { $in: ['Pending', 'Completed'] },
  };

  // Optional date filter
  if (days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    matchStage.createdAt = { $gte: date };
  }

  const trendingProducts = await Order.aggregate([
    { $match: matchStage },
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.product',
        totalSold: { $sum: '$products.quantity' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $lookup: {
        from: 'categories',
        localField: 'productDetails.category',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },
    { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: '$_id',
        name: '$productDetails.name',
        price: '$productDetails.price',
        images: '$productDetails.images',
        category: '$categoryDetails.name',
        brand: '$productDetails.brand',
        totalSold: 1,
      },
    },
  ]);

  return trendingProducts;
};

const getProductStatisticsPayment = async () => {
  const stats = await Order.aggregate([
    {
      $match: {
        status: { $in: ['Pending', 'Completed'] },
        paymentStatus: { $in: ['Paid', 'Pending'] },
      },
    },
    { $unwind: '$products' },

    {
      $lookup: {
        from: 'products',
        localField: 'products.product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },

    {
      $lookup: {
        from: 'categories',
        localField: 'productDetails.category',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },
    { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },

    {
      $addFields: {
        quantity: '$products.quantity',
        price: '$productDetails.price',
        revenue: { $multiply: ['$products.quantity', '$productDetails.price'] },
      },
    },

    {
      $group: {
        _id: {
          category: '$categoryDetails.name',
          product: '$productDetails.name',
          paymentStatus: '$paymentStatus',
        },
        totalSold: { $sum: '$quantity' },
        totalRevenue: { $sum: '$revenue' },
      },
    },
  ]);

  const categoryMap = new Map<
    string,
    {
      Paid: { totalSold: number; totalRevenue: number };
      Pending: { totalSold: number; totalRevenue: number };
    }
  >();

  const productStats: {
    product: string;
    category: string;
    paymentStatus: 'Paid' | 'Pending';
    totalSold: number;
    totalRevenue: number;
  }[] = [];

  let grandRevenue = 0;

  stats.forEach((item) => {
    const category = item._id.category || 'Uncategorized';
    const product = item._id.product;
    const paymentStatus = item._id.paymentStatus;
    const { totalSold, totalRevenue } = item;

    productStats.push({
      product,
      category,
      paymentStatus,
      totalSold,
      totalRevenue,
    });

    const existing: any = categoryMap.get(category) || {
      Paid: { totalSold: 0, totalRevenue: 0 },
      Pending: { totalSold: 0, totalRevenue: 0 },
    };

    existing[paymentStatus].totalSold += totalSold;
    existing[paymentStatus].totalRevenue += totalRevenue;

    categoryMap.set(category, existing);

    grandRevenue += totalRevenue;
  });

  const categoryStats = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      Paid: data.Paid,
      Pending: data.Pending,
    }),
  );

  return { categoryStats, productStats, grandRevenue };
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getOrderByEmailFromDB,
  getTrendingProductsFromDB,
  getProductStatisticsPayment,
};
