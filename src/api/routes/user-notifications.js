import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as userNotificationController from '../controllers/user-notification.js';
import * as validationMiddleware from '../middlewares/validation.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/user-notifications', router);

  router.get(
    '/',
    authMiddleware.isAuthorized,
    userNotificationController.getUserNotification
  );

  router.post(
    '/read-all',
    authMiddleware.isAuthorized,
    userNotificationController.readAllNotification
  );

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    validationMiddleware.isUserNotificationExists,
    userNotificationController.updateUserNotification
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthorized,
    validationMiddleware.isUserNotificationExists,
    userNotificationController.destroyUserNotification
  );
};
