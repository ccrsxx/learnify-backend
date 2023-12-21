import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Model } from 'sequelize';
import { JWT_SECRET } from '../../libs/env.js';
import * as resetPasswordRepository from '../repositories/password-reset.js';
import * as userService from '../services/user.js';
import * as userRepository from '../repositories/user.js';
import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import * as UserModel from '../models/user.js';
import { sequelize } from '../models/index.js';
import { generateRandomToken } from '../../libs/utils.js';
import { sendResetPasswordEmail } from '../../libs/mail.js';

/**
 * Generate hash password with bcrypt
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password, salt = 10) {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw generateApplicationError(err, 'Error while hashing password', 500);
  }
}

/**
 * Compare password with hashed password
 *
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export async function isPasswordMatch(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (err) {
    throw generateApplicationError(err, 'Error while comparing password', 500);
  }
}

/**
 * Generate token with JWT
 *
 * @param {string} id
 * @returns {Promise<string>}
 */
export async function generateToken(id) {
  try {
    const token = await jwt.sign({ id }, JWT_SECRET, {
      expiresIn: '1d'
    });
    return token;
  } catch (err) {
    throw generateApplicationError(err, 'Error while generating token', 500);
  }
}

/**
 * Verify token with JWT
 *
 * @param {string} token
 * @returns {Promise<Model<UserModel.UserAttributes>>}
 */
export async function verifyToken(token) {
  try {
    const { id } = /** @type {jwt.JwtPayload} */ (
      await jwt.verify(token, JWT_SECRET)
    );

    const user = await userService.getUser(id);
    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while verifying token', 500);
  }
}

/** @param {string} email */
export async function sendVerifyToResetPassword(email) {
  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    const verifyToReset = await sequelize.transaction(async (transaction) => {
      await resetPasswordRepository.setUsedTrueByUserId(
        user.dataValues.id,
        transaction
      );

      const nextHourDate = new Date();

      nextHourDate.setHours(nextHourDate.getHours() + 1);

      const payload = {
        token: generateRandomToken(),
        user_id: user.dataValues.id,
        expired_at: nextHourDate
      };

      const verifyToReset = await resetPasswordRepository.setPasswordReset(
        payload,
        transaction
      );

      await sendResetPasswordEmail(email, verifyToReset.dataValues.token);

      return verifyToReset;
    });

    return verifyToReset;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while creating reset password link',
      500
    );
  }
}

/** @param {string} token */
export async function checkLinkToResetPassword(token) {
  try {
    const resetPasswordData =
      await resetPasswordRepository.getDataPasswordResetByToken(token);

    if (!resetPasswordData) {
      throw new ApplicationError('Verification invalid', 404);
    }

    return resetPasswordData;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while checking reset password link',
      500
    );
  }
}

/** @param {{ token: string; password: string }} payload */
export async function changePassword(payload) {
  const { token, password } = payload;

  try {
    const resetPasswordData = await checkLinkToResetPassword(token);
    const user_id = resetPasswordData.dataValues.user_id;
    const encryptedPassword = await hashPassword(password);

    const updatePassword = {
      password: encryptedPassword
    };

    await sequelize.transaction(async (transaction) => {
      await userRepository.updateUser(user_id, updatePassword, transaction);
      await resetPasswordRepository.updateUsedPasswordResetLink(
        token,
        transaction
      );
    });
  } catch (err) {
    throw generateApplicationError(err, 'Error changing password', 500);
  }
}
