import { Router } from 'express';
import { generateRandomCategory } from '../../libs/seed.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/course-categories', router);

  router.get('/', (_req, res) => {
    res.status(200).json({
      data: Array.from({ length: 10 }, generateRandomCategory)
    });
  });
};
