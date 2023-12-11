import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as userPaymentController from '../controllers/user-payment.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */

export default (app) => {
  const router = Router();

  app.use('/user-payments', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    userPaymentController.payCourse
  );

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    userPaymentController.updatePayCourse
  );
};
