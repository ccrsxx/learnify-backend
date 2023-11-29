import { generateApplicationError } from '../../libs/error.js';
import * as courseRepository from '../repositories/course.js';

/** @param {any} params */
export async function getCourses(params) {
  const { name, category, difficulty, premium } = params;

  try {
    if (name || premium || category || difficulty) {
      const filter = {};
      if (name) filter.name = name;
      if (premium) filter.premium = premium;
      if (category) filter.category = category;
      if (difficulty) filter.difficulty = difficulty;

      const courses = await courseRepository.getCourseByFilter(filter);
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
