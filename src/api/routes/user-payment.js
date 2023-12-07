import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as userPaymentController from '../controllers/user-payment.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */

export default (app) => {
  const router = Router();

  app.use('/user-payments', router);

  router.post('/pay-course', userPaymentController.payCourse);
  router.put('/pay-course', userPaymentController.updatePayCourse);
};
