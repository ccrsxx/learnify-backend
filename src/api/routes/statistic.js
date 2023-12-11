import { Router } from 'express';
import { statistic } from '../controllers/statistic.js';
import * as Types from '../../libs/types/common.js';
import * as authMiddleware from '../middlewares/auth.js';
/**
 * @type {Types.Route}
 * @returns {void}
 */

export default (app) => {
  const router = Router();

  app.use('/dashboard', router);

  router.get(
    '/statistic',
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    statistic
  );
};
