import { generateApplicationError } from '../../libs/error.js';
import * as courseRepository from '../repositories/course.js';

/** @param {any} params */
export async function getCourses(params) {
  const { type, filter, category, difficulty, search } = params;

  try {
    if (type || filter || category || difficulty || search) {
      const filters = {};
      if (type) filters.type = type;
      if (filter) filters.filter = filter.split(','); // waiting for table user course
      if (category) filters.category = category.split(',');
      if (difficulty) filters.difficulty = difficulty.split(',');
      if (search) filters.search = search;

      const courses = await courseRepository.getCourseByFilter(filters);
      return courses;
    }
    const courses = await courseRepository.getCourses();
    return courses;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting courses', 500);
  }
}

/** @param {string} id */
export async function getCourseById(id) {
  try {
    const course = await courseRepository.getCourseById(id);

    return course;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting course details',
      500
    );
  }
}

/** @param {string} id */
export async function getCourseDataById(id) {
  try {
    const courseData = await courseRepository.getCourseDataById(id);

    return courseData;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting course data', 500);
  }
}
