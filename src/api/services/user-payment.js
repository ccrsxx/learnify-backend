// @ts-nocheck
import { generateApplicationError } from '../../libs/error.js';
import * as paymentRepository from '../repositories/user-payment.js';
import * as courseMaterialRepository from '../repositories/course-material.js';
import * as userCourseRepository from '../repositories/user-course.js';
import * as courseMaterialStatusRepository from '../repositories/course-material-status.js';
import { sequelize } from '../models/index.js';

/** @param {{ user_id: any; course_id: any; payment_method: any }} params */
export async function payCourse(courseId, userId) {
  try {
    const payload = {
      user_id: userId,
      course_id: courseId,
      expired_at: new Date(Date.now() + 5 * 60000)
    };

    const payment = await paymentRepository.payCourse(payload);
    return payment;
  } catch (err) {
    throw generateApplicationError(err, 'Payment is not completed', 500);
  }
}

/** @param {{ payment_method?: any; course_id?: any }} params */
export async function updatePayCourse(paymentMethod, paymentId, userId) {
  try {
    await sequelize.transaction(async (t) => {
      // GET COURSE ID
      const courseId = await paymentRepository.getCourseIdByPaymentId(
        paymentId,
        {
          transaction: t
        }
      );

      // USER COURSE PAYLOAD
      const userCoursePayload = {
        user_id: userId,
        course_id: courseId
      };

      // CHECK AND CREATE USER COURSE
      // Check if userCourse already exists
      const existingUserCourse =
        await userCourseRepository.getUserCourseByUserIdAndCourseId(
          userId,
          courseId,
          { transaction: t }
        );
      if (existingUserCourse) {
        throw new Error(
          'User is already enrolled in this course. Transaction rolled back.'
        );
      } else {
        await userCourseRepository.createUserCourse(userCoursePayload, {
          transaction: t
        });
      }

      // GET ALL MATERIALS ID
      const materialsId =
        await courseMaterialRepository.getCourseMaterialByCourseId(courseId, {
          transaction: t
        });

      // CREATE MATERIAL STATUS
      for (const course_material_id of materialsId) {
        await courseMaterialStatusRepository.setCourseMaterialStatus(
          {
            user_id: userId,
            course_material_id
          },
          { transaction: t }
        );
      }

      const payload = {
        payment_status: 'COMPLETED',
        payment_method: paymentMethod
      };

      const [, [updatePay]] = await paymentRepository.updatePayCourse(
        payload,
        paymentId,
        { transaction: t }
      );

      return updatePay;
    });
  } catch (error) {
    throw generateApplicationError(error, 'Payment is error', 500);
  }
}
