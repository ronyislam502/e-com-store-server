import { Router } from 'express';
import { PaymentControllers } from './payment.controller';

const router = Router();

router.post('/confirm', PaymentControllers.confirmPayment);

export const PaymentRoutes = router;
