import { ApplicationError } from '../../libs/error.js';
import * as Types from '../../libs/types/common.js';
import * as paymentServices from '../services/user-payment.js';
/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */

export async function payCourse(req, res) {
  const { course_id: courseId } = req.body;

  const { id: userId } = res.locals.user;
  try {
    const data = await paymentServices.payCourse(courseId, userId);

    res.status(201).json(data);
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function updatePayCourse(req, res) {
  try {
    const id = req.params.id;
    const { payment_method: paymentMethod } = req.body;

    const updatedData = await paymentServices.updatePayCourse(
      paymentMethod,
      id
    );
    res.status(200).json(updatedData);
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
