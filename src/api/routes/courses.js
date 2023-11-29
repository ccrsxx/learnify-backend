import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as courseController from '../controllers/course.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/courses', router);

  router.get('/', courseController.getCourses);
  router.route('/:id').get(courseController.getCoursesById);
  router.route('/:id/data').get(courseController.getCourseDataById);
};
