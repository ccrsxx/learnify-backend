// @ts-nocheck
import { generateApplicationError } from '../../libs/error.js';
import * as paymentRepository from '../repositories/user-payment.js';

/** @param {{ user_id: any; course_id: any; payment_method: any }} params */
export async function payCourse(courseId, userId) {
  try {
    const query = {
      user_id: userId,
      course_id: courseId,
      expired_at: new Date(Date.now() + 5 * 60000)
    };

    const payment = await paymentRepository.payCourse(query);
    return payment;
  } catch (err) {
    throw generateApplicationError(err, 'Payment is not completed', 500);
  }
}

/** @param {{ payment_method?: any; course_id?: any }} params */
export async function updatePayCourse(paymentMethod, id) {
  try {
    const payload = {
      payment_status: 'COMPLETED',
      payment_method: paymentMethod
    };
    const [, [updatePay]] = await paymentRepository.updatePayCourse(
      payload,
      id
    );

    // *transaction pending*
    // if (params.isVerif == true) {
    //   const material_id =
    //     await courseMaterialRepository.getCourseMaterialByCourseId(course_id);

    //   await Promise.all(
    //     material_id.map(
    //       async (course_material_id) =>
    //         await courseRepository.setCourseMaterialStatus({
    //           user_id: params.user_id,
    //           course_material_id
    //         })
    //     )
    //   );

    //   const [_, updatePay] = await paymentRepository.updatePayCourse({
    //     ...params,
    //     payment_status: 'COMPLETED'
    //   });

    //   return updatePay;
    // }

    return updatePay;
  } catch (error) {
    throw generateApplicationError(error, 'Payment is error', 500);
  }
}
