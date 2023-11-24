import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import { generateRandomCourse } from '../../libs/seed.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/courses', router);

  router.get('/', (_req, res) => {
    res.status(200).json({
      data: Array.from({ length: 50 }, generateRandomCourse)
    });
  });
};
