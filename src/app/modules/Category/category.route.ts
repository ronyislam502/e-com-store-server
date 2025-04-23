import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';
import { CategoryControllers } from './category.controller';

const router = Router();

router.post(
  '/create-category',
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.get('/', CategoryControllers.getAllCategories);

router.get('/:id', CategoryControllers.getSingleCategory);

router.patch(
  '/update/:id',
  validateRequest(CategoryValidations.updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

router.delete('/delete/:id', CategoryControllers.deleteCategory);

export const CategoryRoutes = router;
