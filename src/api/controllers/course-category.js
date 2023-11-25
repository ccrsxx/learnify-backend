import * as courseCategoryService from '../services/course-category.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function listCourseCategories(_req, res) {
  const data = await courseCategoryService.listCourseCategories();
  res.status(200).json({
    message: 'success',
    results: data.length,
    data
  });
}
