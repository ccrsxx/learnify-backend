import { ApplicationError } from '../../libs/error.js';
import { uploadCloudinary } from '../middlewares/upload.js';
import * as Types from '../../libs/types/common.js';
import * as userService from '../services/user.js';
import * as authService from '../services/auth.js';

/**
 * @type {Types.AuthorizedController}
 * @returns {void}
 */
export function getCurrentUser(_req, res) {
  const user = res.locals.user;

  res.status(200).json({ data: user });
}

/**
 * @type {Types.AuthorizedController<typeof uploadCloudinary>}
 * @returns {Promise<void>}
 */
export async function updateUser(req, res) {
  const { body } = req;

  const { id: userId } = res.locals.user;

  const image = res.locals.image;

  const bodyWithImage = { ...body, image };

  try {
    const updatedUser = await userService.updateUser(userId, bodyWithImage);

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

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function resetPasswordProfile(req, res) {
  const { id, email } = res.locals.user;

  const { old_password, new_password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);

    const isOldPasswordMatch = await authService.isPasswordMatch(
      old_password,
      user.dataValues.password
    );

    if (!isOldPasswordMatch) {
      res.status(401).json({ message: 'Old password is not match' });
      return;
    }

    const encryptedNewPassword = await authService.hashPassword(new_password);

    const resetPassword = await userService.resetPasswordProfile(
      id,
      encryptedNewPassword
    );

    res.status(200).json({
      message: 'Password successfully updated',
      data: resetPassword
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
