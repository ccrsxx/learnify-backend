import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as dashboardController from '../controllers/dashboard.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/dashboard', router);

  router.get(
    '/statistics',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    dashboardController.getStatistics
  );
};
