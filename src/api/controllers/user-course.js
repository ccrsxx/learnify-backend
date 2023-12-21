import { ApplicationError } from '../../libs/error.js';
import * as Types from '../../libs/types/common.js';
import * as userCourseServices from '../services/user-course.js';

/**
 * @type {Types.AuthorizedController}
 * @returns {Promise<void>}
 */
export async function setOnboardedTrue(req, res) {
  const { id } = req.params;
  try {
    const updatedUserCourse = await userCourseServices.setOnboardedTrue(id);

    res.status(200).json({
      message: 'Onboarded updated successfully',
      data: updatedUserCourse
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
