import * as courseMaterialStatusService from '../services/course-material-status.js';
import { ApplicationError } from '../../libs/error.js';

// @ts-ignore
export async function updateCourseMaterialStatus(req, res) {
  const { id } = req.params;

  try {
    await courseMaterialStatusService.getCourseMaterialStatusById(id);

    // @ts-ignore
    const CourseMaterialStatus =
      await courseMaterialStatusService.updateCourseMaterialStatus(id);

    res.status(200).json({
      message: 'Course material status updated successfully',
      data: CourseMaterialStatus
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
