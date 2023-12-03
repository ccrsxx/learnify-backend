import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Model } from 'sequelize';
import { JWT_SECRET } from '../../libs/env.js';
import * as userService from '../services/user.js';
import { generateApplicationError } from '../../libs/error.js';
import * as Models from '../models/user.js';
import otpGenerator from 'otp-generator';

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

export function generateOTP() {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
  return otp;
}
