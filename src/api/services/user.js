import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import { omitPropertiesFromObject } from '../../libs/utils.js';
import * as authService from '../services/auth.js';
import * as userRepository from '../repositories/user.js';
import * as userNotificationService from '../services/user-notification.js';
import * as Models from '../models/user.js';

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

/** @param {string} email */
export async function getUnverifiedUserByEmail(email) {
  try {
    const user = await userRepository.getUnverifiedUser(email);

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
    'verified',
    'password',
    'created_at',
    'updated_at'
  ]);

  try {
    const encryptedPassword = await authService.hashPassword(password);

    const parsedUserWithEncryptedPassword =
      /** @type {Models.UserAttributes} */ ({
        ...parsedPayload,
        password: encryptedPassword
      });

    const verifiedUser =
      await userRepository.getVerifiedUserWithEmailAndPhoneNumber(
        email,
        phone_number
      );

    if (verifiedUser) {
      const errorMessage =
        verifiedUser.dataValues.email === email
          ? 'Email already exists'
          : 'Phone number already exists';

      throw new ApplicationError(errorMessage, 409);
    }

    /** @type {Awaited<ReturnType<typeof userRepository.createUser>>} */
    let user;

    const unverifiedUser =
      await userRepository.getUnverifiedUserByEmailAndPhoneNumber(
        email,
        phone_number
      );

    if (unverifiedUser) {
      const [, [updatedUser]] = await userRepository.updateUser(
        unverifiedUser.dataValues.id,
        parsedUserWithEncryptedPassword
      );

      user = updatedUser;
    } else {
      const newUser = await userRepository.createUser(
        parsedUserWithEncryptedPassword
      );

      user = newUser;
    }

    await authService.sendOtpRequest(email, user.dataValues.id, () =>
      userNotificationService.createUserNotification(user.dataValues.id, {
        name: 'Notifikasi',
        description: 'Selamat datang di Learnify!'
      })
    );

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
      'admin',
      'verified',
      'password',
      'created_at',
      'updated_at'
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
