import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/users', router);

  router.get('/me', authMiddleware.isAuthorized, userController.getCurrentUser);

  router.put('/me', authMiddleware.isAuthorized, userController.updateUser);
};
