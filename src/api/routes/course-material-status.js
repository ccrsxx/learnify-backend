import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as validationMiddleware from '../middlewares/validation.js';
import * as courseMaterialStatusController from '../controllers/course-material-status.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/course-material-status', router);

  router.put(
    '/:id',
    validationMiddleware.isCourseMaterialStatusExists,
    courseMaterialStatusController.updateCourseMaterialStatus
  );
};
