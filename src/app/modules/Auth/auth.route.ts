import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParse';
import { UserControllers } from '../User/user.controller';
import { UserValidations } from '../User/user.validation';

const router = express.Router();

router.post(
  '/signin',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/signup',
  multerUpload.single('image'),
  parseBody,
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

// router.post(
//   '/change-password',
//   validateRequest(AuthValidation.changePasswordValidationSchema),
//   AuthControllers.changePassword,
// );

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

// router.post(
//   '/forget-password',
//   validateRequest(AuthValidation.forgetPasswordValidationSchema),
//   AuthControllers.forgetPassword,
// );

// router.post(
//   '/reset-password',
//   validateRequest(AuthValidation.forgetPasswordValidationSchema),
//   AuthControllers.resetPassword,
// );

export const AuthRoutes = router;
