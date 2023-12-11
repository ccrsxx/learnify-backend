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
    const { newPayment, ...payment } = await paymentServices.payCourse(
      courseId,
      userId
    );

    const message = newPayment
      ? 'Payment created successfully'
      : 'Payment already exists and not expired yet';

    res.status(201).json({
      message: message,
      data: payment
    });
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
    const { id: paymentId } = req.params;
    const { id: userId } = res.locals.user;
    const { payment_method: paymentMethod } = req.body;

    const payment = await paymentServices.updatePayCourse(
      paymentMethod,
      paymentId,
      userId
    );

    res.status(200).json({
      message: 'Payment successfully updated',
      data: payment
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
