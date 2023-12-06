import { generateApplicationError } from '../../libs/error.js';
import * as paymentRepository from '../repositories/payment.js';
import * as courseRepository from '../repositories/course.js';

/** @param {{ user_id: any; course_id: any; payment_method: any }} params */
export async function payCourse(params) {
  try {
    const { user_id, course_id, payment_method } = params;
    const query = {
      payment_status: 'PENDING',
      payment_method,
      user_id,
      course_id,
      expired_at: new Date(Date.now() + 5 * 60000).toISOString()
    };
    const payment = await paymentRepository.payCourse(query);
    return payment;
  } catch (err) {
    throw generateApplicationError(err, 'Payment is not completed', 500);
  }
}

/** @param {{ payment_method?: any; course_id?: any }} params */
export async function updatePayCourse(params) {
  try {
    const { course_id } = params;
    if (!params.payment_method) {
      const material_id = await courseRepository.getCourseMaterialId(course_id);

      await Promise.all(
        // @ts-ignore
        material_id.map(
          async (/** @type {any} */ course_material_id) =>
            // @ts-ignore
            await courseRepository.setCourseMaterialStatus({
              // @ts-ignore
              user_id: params.user_id,
              // @ts-ignore
              course_material_id
            })
        )
      );
      // @ts-ignore
      const [_, updatePay] = await paymentRepository.updatePayCourse(params);
      return updatePay;
    }
  } catch (error) {
    throw generateApplicationError(error, 'Payment is not completed', 500);
  }
}
