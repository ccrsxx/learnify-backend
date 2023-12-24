import { ApplicationError } from '../../libs/error.js';
import * as courseMaterialStatusService from '../services/course-material-status.js';
import * as Types from '../../libs/types/common.js';

/** @type {Types.AuthorizedController} */
export async function updateCourseMaterialStatus(req, res) {
  const { id } = req.params;
  const { id: userId } = res.locals.user;

  try {
    await courseMaterialStatusService.getCourseMaterialStatusByUserId(
      id,
      userId
    );

    const courseMaterialStatus =
      await courseMaterialStatusService.updateCourseMaterialStatus(id);

    res.status(200).json({
      message: 'Course material status updated successfully',
      data: courseMaterialStatus
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
