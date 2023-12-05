import { generateApplicationError } from '../../libs/error.js';
import * as paymentRepository from '../repositories/payment.js';

/** @param {{ user_id: any; course_id: any; payment_method: any }} params */
export async function payCourse(params) {
  try {
    const { user_id, course_id, payment_method } = params;
    const query = { paid: true, payment_method, user_id, course_id };
    const payment = await paymentRepository.payCourse(query);

    return payment;
  } catch (err) {
    throw generateApplicationError(err, 'Payment is not completed', 500);
  }
}
