import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    user: z.string(),
    feedback: z.string(),
    rating: z.number(),
  }),
});

export const ReviewValidations = {
  createReviewValidationSchema,
};
