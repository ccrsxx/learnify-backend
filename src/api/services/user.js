import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import { omitPropertiesFromObject } from '../../libs/utils.js';
import * as authService from '../services/auth.js';
import * as userRepository from '../repositories/user.js';
import * as Models from '../models/user.js';
import * as UserNotificationService from '../services/user-notification.js';

/** @param {string} id */
export async function getUser(id) {
  try {
    const user = await userRepository.getUser(id);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

/** @param {string} email */
export async function getUserByEmail(email) {
  try {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

/** @param {string} phoneNumber */
export async function getUserByPhoneNumber(phoneNumber) {
  try {
    const user = await userRepository.getUserByPhoneNumber(phoneNumber);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

/** @param {string} email */
export async function getAdminUserByEmail(email) {
  try {
    const user = await userRepository.getAdminUserByEmail(email);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

/** @param {string} phoneNumber */
export async function getAdminUserByPhoneNumber(phoneNumber) {
  try {
    const user = await userRepository.getAdminUserByPhoneNumber(phoneNumber);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

/** @param {Models.UserAttributes} payload */
export async function createUser(payload) {
  const { email, phone_number, password } = payload;

  const parsedPayload = omitPropertiesFromObject(payload, [
    'id',
    'admin',
    'password',
    'created_at',
    'updated_at'
  ]);

  try {
    const encryptedPassword = await authService.hashPassword(password);

    const parsedUserWithEncryptedPassword =
      /** @type {Models.UserAttributes} */ ({
        ...parsedPayload,
        admin: false,
        password: encryptedPassword
      });

    const unverifiedUser = email
      ? await userRepository.getUnverifiedUserByEmail(email)
      : await userRepository.getAdminUserByPhoneNumber(phone_number);

    if (unverifiedUser) {
      const [, [user]] = await userRepository.updateUser(
        unverifiedUser.dataValues.id,
        parsedUserWithEncryptedPassword
      );

      await UserNotificationService.createUserNotification(user.dataValues.id, {
        name: 'Notifikasi',
        description: 'Selamat datang di Learnify!'
      });

      return user;
    }
    const user = await userRepository.createUser(
      parsedUserWithEncryptedPassword
    );

    await UserNotificationService.createUserNotification(user.dataValues.id, {
      name: 'Notifikasi',
      description: 'Selamat datang di Learnify!'
    });

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while creating user', 500);
  }
}

/**
 * @param {string} id
 * @param {Partial<Models.UserAttributes>} payload
 */
export async function updateUser(id, payload) {
  try {
    const parsedPayload = omitPropertiesFromObject(payload, [
      'id',
      'email',
      'admin',
      'password',
      'created_at',
      'updated_at',
      'phone_number'
    ]);

    const [, [user]] = await userRepository.updateUser(id, parsedPayload);

    const parsedUser = omitPropertiesFromObject(user.dataValues, [
      'admin',
      'password'
    ]);

    return parsedUser;
  } catch (err) {
    throw generateApplicationError(err, 'Error while updating user', 500);
  }
}

/** @param {string} id */
export async function destroyUser(id) {
  try {
    const user = await userRepository.destroyUser(id);
    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while deleting user', 500);
  }
}

/**
 * @param {string} id
 * @param {string} newPassword
 */
export async function resetPasswordProfile(id, newPassword) {
  try {
    const [, [resetPassword]] = await userRepository.resetPasswordProfile(
      id,
      newPassword
    );

    return resetPassword;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while resetting password profile',
      500
    );
  }
}
