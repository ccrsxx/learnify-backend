import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import * as courseMaterialStatusRepository from '../repositories/course-material-status.js';

/** @param {string} id */
export async function getCourseMaterialStatusById(id) {
  try {
    const courseMaterialStatus =
      await courseMaterialStatusRepository.getCourseMaterialStatusById(id);

    if (!courseMaterialStatus) {
      throw new ApplicationError('Course material status not found', 404);
    }

    return courseMaterialStatus;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting course material status details',
      500
    );
  }
}

/**
 * @param {string} id
 * @param {string} userId
 */
export async function getCourseMaterialStatusByUserId(id, userId) {
  try {
    const isUserExist =
      await courseMaterialStatusRepository.getCourseMaterialStatusByUserId(
        id,
        userId
      );

    if (!isUserExist) {
      throw new ApplicationError(
        'Your not allowed to access this course material status',
        403
      );
    }

    return isUserExist;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting course material status user',
      500
    );
  }
}

/** @param {string} id */
export async function updateCourseMaterialStatus(id) {
  try {
    const [, [courseMaterialStatus]] =
      await courseMaterialStatusRepository.updateCourseMaterialStatus(id);

    return courseMaterialStatus;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while updating course material status',
      500
    );
  }
}
