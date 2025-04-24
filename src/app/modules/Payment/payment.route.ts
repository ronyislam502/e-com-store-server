import { Router } from 'express';
import { PaymentControllers } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/confirm',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PaymentControllers.confirmPayment,
);

export const PaymentRoutes = router;
