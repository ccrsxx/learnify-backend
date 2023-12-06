import { generateApplicationError } from '../../libs/error.js';
import * as paymentRepository from '../repositories/payment.js';
import * as courseRepository from '../repositories/course.js';

/** @param {{ user_id: any; course_id: any; payment_method: any }} params */
export async function payCourse(params) {
  try {
    const { user_id, course_id } = params;
    const query = {
      payment_status: 'PENDING',
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
    // @ts-ignore
    const { course_id } = params;
    // @ts-ignore
    const [_, updatePay] = await paymentRepository.updatePayCourse({
      payment_status: 'WAITING_VERIFICATION',
      ...params
    });
    // @ts-ignore
    if (params.isVerif == true) {
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
      const [_, updatePay] = await paymentRepository.updatePayCourse({
        ...params,
        payment_status: 'COMPLETED'
      });
      return updatePay;
    }

    return updatePay;
  } catch (error) {
    throw generateApplicationError(error, 'Payment is not completed', 500);
  }
}
