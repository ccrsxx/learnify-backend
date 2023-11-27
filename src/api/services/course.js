import { generateApplicationError } from '../../libs/error.js';
import * as courseRepository from '../repositories/course.js';

export async function getCourses() {
  try {
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
