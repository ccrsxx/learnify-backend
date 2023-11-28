import { generateApplicationError } from '../../libs/error.js';
import * as courseRepository from '../repositories/course.js';

/** @param {any} category */
export async function getCourses(category) {
  try {
    if (category) {
      const courses = await courseRepository.getCourseByCategory(category);
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

/** @param {string} id */
export async function getCourseFullDataById(id) {
  try {
    const courseData = await courseRepository.getCourseFullDataById(id);

    return courseData;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting course full data',
      500
    );
  }
}
