import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as userPaymentController from '../controllers/user-payment.js';
import * as validationMiddleware from '../middlewares/validation.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/user-payments', router);

  router.get(
    '/',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    userPaymentController.getPayments
  );

  router.post(
    '/',
    authMiddleware.isAuthorized,
    validationMiddleware.isCourseExists,
    userPaymentController.payCourse
  );

  router.get(
    '/me',
    authMiddleware.isAuthorized,
    userPaymentController.getPaymentsHistory
  );

  router.get(
    '/:id',
    authMiddleware.isAuthorized,
    validationMiddleware.isPaymentExists,
    userPaymentController.getPaymentById
  );

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    validationMiddleware.isPaymentExists,
    userPaymentController.updatePayCourse
  );
};
