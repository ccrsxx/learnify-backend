import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as paymentController from '../controllers/payment.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */

export default (app) => {
  const router = Router();

  app.use('/user-payments', router);

  router.post('/pay-course', paymentController.payCourse);
};
