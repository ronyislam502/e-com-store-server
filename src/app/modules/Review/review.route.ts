import express from 'express';
import { ReviewControllers } from './review.controller';

const router = express.Router();

router.post('/create-review', ReviewControllers.createReview);

router.get('/', ReviewControllers.getAllReviews);

export const ReviewRoutes = router;
