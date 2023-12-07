import { ApplicationError } from '../../libs/error.js';
import * as Types from '../../libs/types/common.js';
import * as userService from '../services/user.js';

/**
 * @type {Types.AuthorizedController}
 * @returns {void}
 */
export function getCurrentUser(_req, res) {
  const user = res.locals.user;

  res.status(200).json({ data: user });
}

/**
 * @type {Types.AuthorizedController}
 * @returns {Promise<void>}
 */
export async function updateUser(req, res) {
  const { body } = req;

  const { id: userId } = res.locals.user;

  try {
    const updatedUser = await userService.updateUser(userId, body);

    res.status(200).json({
      message: 'User profile updated successfully',
      data: updatedUser
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
