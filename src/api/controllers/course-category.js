import * as courseCategoryService from '../services/course-category.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function getCourseCategories(_req, res) {
  const data = await courseCategoryService.getCourseCategories();
  res.status(200).json({ data });
}
