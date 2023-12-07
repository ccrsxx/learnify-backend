// @ts-nocheck
import { generateApplicationError } from '../../libs/error.js';
import * as paymentRepository from '../repositories/user-payment.js';
import * as courseRepository from '../repositories/course.js';
import * as courseMaterialRepository from '../repositories/course-material.js';

/** @param {{ user_id: any; course_id: any; payment_method: any }} params */
export async function payCourse(params) {
  try {
    const { user_id, course_id } = params;

    const query = {
      user_id,
      course_id,
      payment_status: 'PENDING',
      expired_at: new Date(Date.now() + 5 * 60000)
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

    const [_, updatePay] = await paymentRepository.updatePayCourse({
      payment_status: 'WAITING_VERIFICATION',
      ...params
    });

    if (params.isVerif == true) {
      const material_id =
        await courseMaterialRepository.getCourseMaterialByCourseId(course_id);

      await Promise.all(
        material_id.map(
          async (course_material_id) =>
            await courseRepository.setCourseMaterialStatus({
              user_id: params.user_id,
              course_material_id
            })
        )
      );

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
