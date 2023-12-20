import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Model } from 'sequelize';
import { randomBytes } from 'crypto';
import { JWT_SECRET } from '../../libs/env.js';
import * as resetPasswordRepositories from '../repositories/password-reset.js';
import * as userService from '../services/user.js';
import * as mailer from './../../libs/mailer.js';
import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import * as Models from '../models/user.js';

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
 * @returns {Promise<Model<Models.UserAttributes>>}
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
export async function sendVerifToResetPassword(email) {
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new ApplicationError('User not found', 404);
    }
    const nextHourDate = new Date();
    const payload = {
      used: false,
      token: randomBytes(24).toString('base64url'),
      expired_at: new Date(nextHourDate.getTime() + 60 * 60 * 1000),
      user_id: user.dataValues.id
    };

    const verifyToReset =
      await resetPasswordRepositories.setPasswordReset(payload);
    const mailInfo = {
      to: email,
      subject: 'Password Reset Verification Required',
      html: `<p>Hi ${email},<br>

      To reset your password for Learnify, please use the following verification link:</p><a href='localhost:3000/auth/password-reset/${verifyToReset.dataValues.token}'>Click here to verify</a><p>If you didn't request this, please contact us immediately at [Your Customer Support Email/Phone].</p><p>Thank you</p><p>Learnify</p>`
    };
    mailer.sendEmail(mailInfo);
    return verifyToReset;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}
