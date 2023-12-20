import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import * as userNotificationRepository from '../repositories/user-notification.js';
import * as UserNotificationModel from '../models/user-notification.js';

/** @param {string} id */
export async function getUserNotification(id) {
  try {
    const notification =
      await userNotificationRepository.getUserNotification(id);

    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting user notification',
      500
    );
  }
}

/** @param {string} id */
export async function getUserNotificationById(id) {
  try {
    const notification =
      await userNotificationRepository.getUserNotificationById(id);

    if (!notification) {
      throw new ApplicationError('User notification not found', 404);
    }

    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting user notification details',
      500
    );
  }
}

/**
 * @param {string} userId
 * @param {Partial<UserNotificationModel.UserNotificationAttributes>} payload
 */
export async function createUserNotification(userId, payload) {
  try {
    const notification =
      await userNotificationRepository.createUserNotification({
        ...payload,
        user_id: userId
      });

    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while creating user notification',
      500
    );
  }
}

/** @param {string} id */
export async function readAllNotification(id) {
  try {
    const [, notification] =
      await userNotificationRepository.readAllNotification(id);

    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting user notifications',
      500
    );
  }
}

/** @param {string} id */
export async function updateUserNotification(id) {
  try {
    const [, [notification]] =
      await userNotificationRepository.updateUserNotification(id);

    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while updating user notifications',
      500
    );
  }
}

/** @param {string} id */
export async function destroyUserNotification(id) {
  try {
    return await userNotificationRepository.destroyUserNotification(id);
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while deleting user notifications',
      500
    );
  }
}
