import { Router } from 'express';
import { OrderControllers } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/create-order',
  auth(USER_ROLE.admin, USER_ROLE.user),
  OrderControllers.createOrder,
);

router.get('/', auth(USER_ROLE.admin), OrderControllers.allOrders);

router.get('/trending-products', OrderControllers.getTrendingProducts);

router.get(
  '/statistic',
  auth(USER_ROLE.admin),
  OrderControllers.statisticPayment,
);

router.get(
  '/:email',
  auth(USER_ROLE.admin, USER_ROLE.user),
  OrderControllers.userOrders,
);

export const OrderRoutes = router;
