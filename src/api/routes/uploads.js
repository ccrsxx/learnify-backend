import { Router } from 'express';
import * as UploadMiddleware from '../middlewares/upload.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/uploads', router);

  router.post(
    '/image',
    UploadMiddleware.parseImage,
    UploadMiddleware.uploadCloudinary
  );
};
