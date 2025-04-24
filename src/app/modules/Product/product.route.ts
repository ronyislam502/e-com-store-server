import express from 'express';
import { ProductControllers } from './product.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParse';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  multerUpload.fields([{ name: 'files' }]),
  parseBody,
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.createProduct,
);

router.get('/', ProductControllers.getAllProducts);

router.get('/:id', ProductControllers.getSingleProduct);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin),
  multerUpload.fields([{ name: 'files' }]),
  parseBody,
  validateRequest(ProductValidations.updateProductValidationSchema),
  ProductControllers.updateProduct,
);

router.delete('/:id', auth(USER_ROLE.admin), ProductControllers.deleteProducts);

export const ProductRoutes = router;
