import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import { omitPropertiesFromObject } from '../../libs/utils.js';
import * as authService from '../services/auth.js';
import * as userRepository from '../repositories/user.js';
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
    const admin = await userRepository.getAdminUserByEmail(email);
    return admin;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

/** @param {string} phoneNumber */
export async function getAdminUserByPhoneNumber(phoneNumber) {
  try {
    const admin = await userRepository.getAdminUserByPhoneNumber(phoneNumber);
    return admin;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

/** @param {Models.UserAttributes} payload */
export async function createUser(payload) {
  const { password } = payload;

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

    const car = await userRepository.createUser(
      parsedUserWithEncryptedPassword
    );
    return car;
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
    const user = await userRepository.updateUser(id, payload);
    return user;
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
