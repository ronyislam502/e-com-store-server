import express from 'express';
import { ProductControllers } from './product.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParse';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';

const router = express.Router();

router.post(
  '/create-product',
  multerUpload.fields([{ name: 'files' }]),
  parseBody,
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.createProduct,
);

router.get('/', ProductControllers.getAllProducts);

router.get('/:id', ProductControllers.getSingleProduct);

router.patch(
  '/update/:id',
  multerUpload.fields([{ name: 'files' }]),
  parseBody,
  validateRequest(ProductValidations.updateProductValidationSchema),
  ProductControllers.updateProduct,
);

router.delete('/:id', ProductControllers.deleteProducts);

export const ProductRoutes = router;
