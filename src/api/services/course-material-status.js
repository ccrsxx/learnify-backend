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
