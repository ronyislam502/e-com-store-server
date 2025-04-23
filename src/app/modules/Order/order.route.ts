import { Router } from 'express';
import { OrderControllers } from './order.controller';

const router = Router();

router.post('/create-order', OrderControllers.createOrder);

router.get('/', OrderControllers.allOrders);

router.get('/trending-products', OrderControllers.getTrendingProducts);

router.get('/statistic', OrderControllers.statisticPayment);

router.get('/:email', OrderControllers.userOrders);

export const OrderRoutes = router;
