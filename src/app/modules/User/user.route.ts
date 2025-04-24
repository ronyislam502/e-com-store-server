import { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParse';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getAllUsers,
);

router.get(
  '/:email',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getSingleUser,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  multerUpload.single('image'),
  parseBody,
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser,
);

export const UserRoutes = router;
