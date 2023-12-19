import { UserNotification } from '../models/index.js';

/** @param {string} userId */
export function getUserNotification(userId) {
  return UserNotification.findAll({ where: { user_id: userId } });
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

/** @param {string} id */
export function destroyUserNotification(id) {
  return UserNotification.destroy({ where: { id: id } });
}
