import { ApplicationError } from '../../libs/error.js';
import { isPaymentExists } from '../middlewares/validation.js';
import * as Types from '../../libs/types/common.js';
import * as paymentServices from '../services/user-payment.js';

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function getPayments(_req, res) {
  try {
    const data = await paymentServices.getPayments();

    res.status(200).json({ data });
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
export async function getPaymentById(req, res) {
  try {
    const { id } = req.params;
    const data = await paymentServices.getUserPaymentById(id);

    res.status(200).json({ data });
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
export async function getPaymentsHistory(_req, res) {
  try {
    const { id: userId } = res.locals.user;
    const data = await paymentServices.getPaymentsHistory(userId);

    res.status(200).json({ data });
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
export async function payCourse(req, res) {
  const { course_id: courseId } = req.body;

  const { id: userId } = res.locals.user;

  try {
    const { newPayment, ...payment } = await paymentServices.payCourse(
      courseId,
      userId
    );

    if (newPayment) {
      res.status(201).json({
        message: 'Payment created successfully',
        data: payment
      });
      return;
    }

    res.status(200).json({
      message: 'Payment already exists and not expired yet',
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
 * @type {Types.AuthorizedController<typeof isPaymentExists>}
 * @returns {Promise<void>}
 */
export async function updatePayCourse(req, res) {
  try {
    const { id: userId } = res.locals.user;
    const { id: paymentId } = req.params;
    const { payment_method: paymentMethod } = req.body;

    const existingPayment = res.locals.payment;

    const payment = await paymentServices.updatePayCourse(
      existingPayment,
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
