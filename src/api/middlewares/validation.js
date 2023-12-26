import { ApplicationError } from '../../libs/error.js';
import { isAdmin, isAuthorized } from './auth.js';
import * as Types from '../../libs/types/common.js';
import * as CourseModel from '../models/course.js';
import * as courseService from '../services/course.js';
import * as paymentServices from '../services/user-payment.js';
import * as UserPaymentModel from '../models/user-payment.js';
import * as userNotificationService from '../services/user-notification.js';
import * as courseMaterialStatusService from '../services/course-material-status.js';
import * as userService from '../services/user.js';
import * as CourseMaterialStatusModel from '../models/course-material-status.js';
import * as UserNotificationModel from '../models/user-notification.js';
import * as UserModel from '../models/user.js';

/**
 * Check if valid credentials.
 *
 * @type {Types.Middleware}
 * @returns {void}
 */
export function isValidCredential(req, res, next) {
  const { email, phone_number, password } = req.body;

  const emailOrPhoneNumber = email || phone_number;

  if (!emailOrPhoneNumber || !password) {
    res
      .status(400)
      .json({ message: 'Email or phone number and password are required' });
    return;
  }

  if (typeof emailOrPhoneNumber !== 'string' || typeof password !== 'string') {
    res
      .status(400)
      .json({ message: 'Email or phone number and password must be string' });
    return;
  }

  next();
}

/**
 * Check if valid credentials.
 *
 * @type {Types.Middleware}
 * @returns {void}
 */
export function isValidEmail(req, res, next) {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  if (typeof email !== 'string') {
    res.status(400).json({ message: 'Email must be string' });
    return;
  }

  next();
}

/**
 * Check if valid credentials.
 *
 * @type {Types.Middleware}
 * @returns {void}
 */
export function isValidResetPasswordPayload(req, res, next) {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: 'Token and password are required' });
    return;
  }

  if (typeof token !== 'string' || typeof password !== 'string') {
    res.status(400).json({ message: 'Token and password must be string' });
    return;
  }

  next();
}

/**
 * Check if valid credentials.
 *
 * @type {Types.Middleware}
 * @returns {void}
 */
export function isValidVerifyOtpPayload(req, res, next) {
  const { otp, email } = req.body;

  if (!otp || !email) {
    res.status(400).json({ message: 'OTP and email are required' });
    return;
  }

  if (typeof otp !== 'string' || typeof email !== 'string') {
    res.status(400).json({ message: 'OTP and email must be string' });
    return;
  }

  next();
}

/**
 * Check if valid credentials.
 *
 * @type {Types.Middleware}
 * @returns {void}
 */
export function isValidResetPasswordProfile(req, res, next) {
  const { old_password, new_password } = req.body;

  if (!old_password || !new_password) {
    res
      .status(400)
      .json({ message: 'Old password and new password are required' });
    return;
  }

  if (typeof old_password !== 'string' || typeof new_password !== 'string') {
    res
      .status(400)
      .json({ message: 'Old password and new password must be string' });
    return;
  }

  if (new_password === old_password) {
    res
      .status(409)
      .json({ message: 'New password cannot be the same as old password' });
    return;
  }

  next();
}

/**
 * Check if valid credentials.
 *
 * @type {Types.Middleware<
 *   Types.ExtractLocalsMiddleware<typeof isValidEmail> & {
 *     user: UserModel.UserAttributes;
 *   }
 * >}
 * @returns {Promise<void>}
 */
export async function isUnverifiedUserExists(req, res, next) {
  const { email } = req.body;

  try {
    const user = await userService.getUnverifiedUserByEmail(email);
    res.locals.user = user.dataValues;
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  next();
}

/**
 * Check if valid credentials.
 *
 * @type {Types.Middleware<
 *   Types.ExtractLocalsMiddleware<typeof isAdmin> & {
 *     course: CourseModel.CourseAttributes;
 *   }
 * >}
 * @returns {Promise<void>}
 */
export async function isCourseExists(req, res, next) {
  // req.body is used in case for checking course exist when create payment
  const id = req.params.id || req.body.course_id;

  try {
    const course = await courseService.getCourseById(id);
    res.locals.course = course.dataValues;
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  next();
}

/**
 * Check if valid credentials.
 *
 * @type {Types.Middleware<
 *   Types.ExtractLocalsMiddleware<typeof isAuthorized> & {
 *     payment: UserPaymentModel.UserPaymentAttributes;
 *   }
 * >}
 * @returns {Promise<void>}
 */
export async function isPaymentExists(req, res, next) {
  const { id } = req.params;

  try {
    const payment = await paymentServices.getUserPaymentById(id);
    res.locals.payment = payment.dataValues;
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  next();
}

/**
 * @type {Types.Middleware<
 *   Types.ExtractLocalsMiddleware<typeof isAuthorized> & {
 *     courseMaterialStatus: CourseMaterialStatusModel.CourseMaterialStatusAttributes;
 *   }
 * >}
 * @returns {Promise<void>}
 */
export async function isCourseMaterialStatusExists(req, res, next) {
  const { id } = req.params;

  try {
    const courseMaterialStatus =
      await courseMaterialStatusService.getCourseMaterialStatusById(id);

    res.locals.courseMaterialStatus = courseMaterialStatus.dataValues;
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  next();
}

/**
 * @type {Types.Middleware<
 *   Types.ExtractLocalsMiddleware<typeof isAuthorized> & {
 *     userNotification: UserNotificationModel.UserNotificationAttributes;
 *   }
 * >}
 * @returns {Promise<void>}
 */
export async function isUserNotificationExists(req, res, next) {
  const { id } = req.params;

  try {
    const userNotification =
      await userNotificationService.getUserNotificationById(id);
    res.locals.userNotification = userNotification.dataValues;
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  next();
}
