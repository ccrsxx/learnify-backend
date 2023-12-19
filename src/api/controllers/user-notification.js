import * as userNotificationService from '../services/user-notification.js';
import * as Types from '../../libs/types/common.js';
import { ApplicationError } from '../../libs/error.js';

/**
 * @type {Types.AuthorizedController}
 * @returns {Promise<void>}
 */
export async function getUserNotification(_req, res) {
  try {
    const { id } = res.locals.user;

    const notification = await userNotificationService.getUserNotification(id);

    res.status(200).json({ data: notification });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.AuthorizedController}
 * @returns {Promise<void>}
 */
export async function readAllNotification(_req, res) {
  try {
    const { id } = res.locals.user;

    const notification = await userNotificationService.readAllNotification(id);

    res.status(200).json({
      message: 'All notifications have been read',
      data: notification
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.AuthorizedController}
 * @returns {Promise<void>}
 */
export async function updateUserNotification(req, res) {
  const { id } = req.params;

  try {
    const notification =
      await userNotificationService.updateUserNotification(id);

    res.status(200).json({
      message: 'User notification updated successfully',
      data: notification
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.AuthorizedController}
 * @returns {Promise<void>}
 */
export async function destroyUserNotification(req, res) {
  const { id } = req.params;

  try {
    await userNotificationService.destroyUserNotification(id);

    res.status(200).json({ message: 'User notification deleted successfully' });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
