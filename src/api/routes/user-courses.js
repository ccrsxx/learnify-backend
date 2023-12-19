import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as userCourseController from '../controllers/user-course.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/user-courses', router);

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    userCourseController.setOnboardedTrue
  );
};
