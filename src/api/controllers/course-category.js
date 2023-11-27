import * as courseCategoryService from '../services/course-category.js';
import * as Types from '../../libs/types/common.js';
import { ApplicationError } from '../../libs/error.js';

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function getCourseCategories(_req, res) {
  try {
    const data = await courseCategoryService.getCourseCategories();

    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
