import { Router } from 'express';
import * as courseCategoryController from '../controllers/course-category.js';
import { generateRandomCategory } from '../../libs/seed.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/course-categories', router);

  router.get('/', courseCategoryController.listCourseCategories);
};
