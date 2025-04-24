import express from 'express';
import { ReviewControllers } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-review',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ReviewControllers.createReview,
);

router.get('/', ReviewControllers.getAllReviews);

export const ReviewRoutes = router;
