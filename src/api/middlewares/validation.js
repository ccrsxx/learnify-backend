import { ApplicationError } from '../../libs/error.js';
import { isAdmin, isAuthorized } from './auth.js';
import * as Types from '../../libs/types/common.js';
import * as courseService from '../services/course.js';
import * as paymentServices from '../services/user-payment.js';
import * as UserPaymentModel from '../models/user-payment.js';
import * as CourseModel from '../models/course.js';
import * as CourseMaterialStatusModel from '../models/course-material-status.js';
import * as courseMaterialStatusService from '../services/course-material-status.js';

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
