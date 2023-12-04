import { ApplicationError } from '../../libs/error.js';
import * as Types from '../../libs/types/common.js';
import * as courseService from '../services/course.js';

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

// @ts-ignore
export async function isCourseExists(req, res, next) {
  const { id } = req.params;

  try {
    const car = await courseService.getCourseById(id);
    res.locals.car = car.dataValues;
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
