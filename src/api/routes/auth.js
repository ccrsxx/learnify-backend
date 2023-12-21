import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import * as validationMiddleware from '../middlewares/validation.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/auth', router);

  router.post(
    '/login',
    validationMiddleware.isValidCredential,
    authController.login
  );

  router.post(
    '/login/admin',
    validationMiddleware.isValidCredential,
    authController.loginWithAdmin
  );

  router.post(
    '/register',
    validationMiddleware.isValidCredential,
    authController.register
  );

  router.post(
    '/password-reset',
    validationMiddleware.isValidEmail,
    authController.sendVerifyToResetPassword
  );

  router.put(
    '/password-reset',
    validationMiddleware.isValidResetPasswordPayload,
    authController.changePassword
  );

  router.get('/password-reset/:token', authController.checkLinkToResetPassword);
};
