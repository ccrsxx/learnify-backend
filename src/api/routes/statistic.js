import { Router } from 'express';
import { statistic } from '../controllers/statistic.js';
import * as Types from '../../libs/types/common.js';
/**
 * @type {Types.Route}
 * @returns {void}
 */

export default (app) => {
  const router = Router();

  app.use('/dashboard', router);

  router.get('/statistic', statistic);
};
