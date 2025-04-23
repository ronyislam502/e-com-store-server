import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    brand: z.string(),
    price: z.number(),
    category: z.string(),
    quantity: z.number(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().optional(),
    category: z.string().optional(),
    quantity: z.number().optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
