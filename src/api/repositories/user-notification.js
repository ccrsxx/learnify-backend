import { UserNotification } from '../models/index.js';
import * as UserNotificationModel from '../models/user-notification.js';

/** @param {string} userId */
export function getUserNotification(userId) {
  return UserNotification.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });
}

/** @param {string} id */
export function getUserNotificationById(id) {
  return UserNotification.findByPk(id);
}

/** @param {string} userId */
export function readAllNotification(userId) {
  return UserNotification.update(
    { viewed: true },
    {
      where: { user_id: userId, viewed: false },
      returning: true
    }
  );
}

/** @param {string} id */
export function updateUserNotification(id) {
  return UserNotification.update(
    { viewed: true },
    {
      where: { id: id },
      returning: true
    }
  );
}

/** @param {Partial<UserNotificationModel.UserNotificationAttributes>} payload */
export function createUserNotification(payload) {
  return UserNotification.create(payload);
}

/** @param {string} id */
export function destroyUserNotification(id) {
  return UserNotification.destroy({ where: { id: id } });
}
