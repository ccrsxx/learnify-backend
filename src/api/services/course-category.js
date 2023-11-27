import { generateApplicationError } from '../../libs/error.js';
import * as courseCategoryRepository from '../repositories/course-category.js';

export async function getCourseCategories() {
  try {
    const categories = await courseCategoryRepository.getCourseCategories();

    return categories;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting course categories',
      500
    );
  }
}
