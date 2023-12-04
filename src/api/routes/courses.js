import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as courseController from '../controllers/course.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as uploadMiddleware from '../middlewares/upload.js';
import * as validationMiddleware from '../middlewares/validation.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/courses', router);

  router
    .route('/')
    .get(courseController.getCourses)
    .post(
      authMiddleware.isAuthorized,
      authMiddleware.isAdmin,
      uploadMiddleware.parseImage,
      uploadMiddleware.uploadCloudinary,
      courseController.createCourse
    );

  router
    .route('/:id')
    .get(courseController.getCourseById)
    .delete(
      authMiddleware.isAuthorized,
      authMiddleware.isAdmin,
      validationMiddleware.isCourseExists,
      courseController.destroyCourse
    );
};
