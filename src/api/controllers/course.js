import * as courseService from '../services/course.js';
import * as Types from '../../libs/types/common.js';
import { ApplicationError } from '../../libs/error.js';

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function getCourses(_req, res) {
  try {
    const data = await courseService.getCourses();

    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
