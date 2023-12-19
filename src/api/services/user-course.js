import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import * as userCourseRepository from '../repositories/user-course.js';

/** @param {string} id */
export async function setOnboardedTrue(id) {
  try {
    const [, [updatedUserCourse]] =
      await userCourseRepository.setOnboardedTrue(id);

    if (!updatedUserCourse) {
      throw new ApplicationError('User Course Not Found', 404);
    }

    return updatedUserCourse;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while updating onboarded status',
      500
    );
  }
}
