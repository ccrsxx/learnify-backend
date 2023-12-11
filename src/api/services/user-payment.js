// @ts-nocheck
import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import * as paymentRepository from '../repositories/user-payment.js';
import * as courseMaterialRepository from '../repositories/course-material.js';
import * as userCourseRepository from '../repositories/user-course.js';
import * as courseMaterialStatusRepository from '../repositories/course-material-status.js';
import { sequelize } from '../models/index.js';

/** @param {{ user_id: any; course_id: any; payment_method: any }} params */
export async function payCourse(courseId, userId) {
  try {
    // Check if course is enrolled
    const existingUserCourse =
      await userCourseRepository.getUserCourseByUserIdAndCourseId(
        userId,
        courseId
      );
    if (existingUserCourse) {
      throw new Error('User is already enrolled in this course.');
    }

    // Check if user created the payment before and the payment is not expired yet
    const existingUserPayment =
      await paymentRepository.getPendingPaymentByUserIdAndCourseId(
        userId,
        courseId
      );

    if (existingUserPayment) {
      const data = {
        message: 'Payment Already Created Before and Not Expired Yet',
        data: existingUserPayment.dataValues.id
      };
      return data;
    }

    // Create User Payment
    const payload = {
      user_id: userId,
      course_id: courseId,
      expired_at: new Date(Date.now() + 5 * 30000)
    };

    const payment = await paymentRepository.payCourse(payload);
    return payment;
  } catch (err) {
    throw generateApplicationError(err, 'Creating payment error', 500);
  }
}

/** @param {{ payment_method?: any; course_id?: any }} params */
export async function updatePayCourse(paymentMethod, paymentId, userId) {
  try {
    // CHECK STATUS PAYMENT
    const existingUserPayment =
      await paymentRepository.getUserPaymentStatusById(paymentId);

    if (existingUserPayment.dataValues.payment_status === 'COMPLETED') {
      throw new ApplicationError('This Course Payment Already Completed');
    }

    // CHECK EXPIRED
    const currentDate = new Date();
    if (existingUserPayment.dataValues.expired_at < currentDate) {
      throw new ApplicationError(
        'This Course Payment Already Expired! Please Create The New Payment'
      );
    }

    const courseId = await paymentRepository.getCourseIdByPaymentId(paymentId);

    const materialsId =
      await courseMaterialRepository.getCourseMaterialByCourseId(courseId);

    const result = await sequelize.transaction(async (t) => {
      // BACKFILL COURSE MATERIAL STATUS
      for (const course_material_id of materialsId) {
        await courseMaterialStatusRepository.setCourseMaterialStatus(
          {
            user_id: userId,
            course_material_id
          },
          { transaction: t }
        );
      }

      // PAYMENT
      const payload = {
        payment_status: 'COMPLETED',
        payment_method: paymentMethod,
        paid_at: new Date()
      };

      const [, [updatePay]] = await paymentRepository.updatePayCourse(
        payload,
        paymentId,
        { transaction: t }
      );

      // USER COURSE CREATE
      const userCoursePayload = {
        user_id: userId,
        course_id: courseId
      };

      await userCourseRepository.createUserCourse(userCoursePayload, {
        transaction: t
      });

      return updatePay;
    });

    return result;
  } catch (error) {
    throw generateApplicationError(error, 'Payment is error', 500);
  }
}
