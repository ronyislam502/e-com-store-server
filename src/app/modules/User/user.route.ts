import { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParse';

const router = Router();

router.get('/', UserControllers.getAllUsers);

router.get('/:email', UserControllers.getSingleUser);

router.patch(
  '/update/:id',
  multerUpload.single('image'),
  parseBody,
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser,
);

export const UserRoutes = router;
