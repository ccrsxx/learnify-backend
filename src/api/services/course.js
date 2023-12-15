import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import { getCourseFilterQuery } from '../../libs/query.js';
import { omitPropertiesFromObject } from '../../libs/utils.js';
import * as courseRepository from '../repositories/course.js';
import * as userCourseRepository from '../repositories/user-course.js';
import * as Models from '../models/course.js';
import * as Types from '../../libs/types/common.js';

/** @param {Types.RequestQuery} params */
export async function getCourses(params) {
  try {
    const queryFilters = await getCourseFilterQuery(params);

    // @ts-ignore
    const sortByNewest = params.filter?.includes?.('new');

    const courses = await (queryFilters
      ? courseRepository.getCoursesByFilter(queryFilters, sortByNewest)
      : courseRepository.getCourses());

    return courses;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting courses', 500);
  }
}

/** @param {string} id */
export async function getUserCourses(id) {
  try {
    const userCourses = await courseRepository.getUserCourses(id);

    return userCourses;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting courses', 500);
  }
}

/**
 * @param {string} id
 * @param {string | null} [userId=null] Default is `null`
 */
export async function getCourseById(id, userId = null) {
  try {
    let course;

    // Check if user is logged in
    if (userId) {
      // Check if user is enrolled in course
      const existingUserCourse =
        await userCourseRepository.getUserCourseByUserIdAndCourseId(userId, id);

      if (existingUserCourse) {
        course = await courseRepository.getCourseWithUserStatus(id, userId);
      }
    }

    // If user is not logged in or not enrolled in course
    if (!course) {
      course = await courseRepository.getCourseById(id);
    }

    // If course is not found
    if (!course) {
      throw new ApplicationError('Course not found', 404);
    }

    return course;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting course details',
      500
    );
  }
}

/**
 * @param {Models.CourseAttributes} payload
 * @param {string} userId
 */
export async function createCourse(payload, userId) {
  const parsedPayload = omitPropertiesFromObject(payload, [
    'id',
    'created_at',
    'updated_at'
  ]);

  const parsedPayloadWithCategoryAndUser =
    /** @type {Models.CourseAttributes} */ ({
      ...parsedPayload,
      user_id: userId
    });

  try {
    const car = await courseRepository.createCourse(
      parsedPayloadWithCategoryAndUser
    );
    return car;
  } catch (err) {
    throw generateApplicationError(err, 'Error while creating course', 500);
  }
}

/**
 * @param {Models.CourseAttributes} payload
 * @param {string} id
 */
export async function updateCourse(id, payload) {
  const parsedPayload = omitPropertiesFromObject(payload, [
    'id',
    'created_at',
    'updated_at'
  ]);

  try {
    const [, [course]] = await courseRepository.updateCourse(id, parsedPayload);

    return course;
  } catch (err) {
    throw generateApplicationError(err, 'Error while updating course', 500);
  }
}

/** @param {string} id */
export async function destroyCourse(id) {
  try {
    return await courseRepository.destroyCourse(id);
  } catch (err) {
    throw generateApplicationError(err, 'Error while deleting course', 500);
  }
}
