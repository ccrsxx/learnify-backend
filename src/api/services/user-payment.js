import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import { sequelize } from '../models/index.js';
import * as paymentRepository from '../repositories/user-payment.js';
import * as courseMaterialRepository from '../repositories/course-material.js';
import * as userCourseRepository from '../repositories/user-course.js';
import * as courseMaterialStatusRepository from '../repositories/course-material-status.js';
import * as userPaymentModel from '../models/user-payment.js';

/**
 * @param {string} courseId
 * @param {string} userId
 */
export async function payCourse(courseId, userId) {
  try {
    // Check if course is enrolled
    const existingUserCourse =
      await userCourseRepository.getUserCourseByUserIdAndCourseId(
        userId,
        courseId
      );

    if (existingUserCourse) {
      throw new ApplicationError(
        'User is already enrolled in this course',
        422
      );
    }

    // Check if user created the payment before and the payment is not expired yet
    const existingUserPayment =
      await paymentRepository.getPendingPaymentByUserIdAndCourseId(
        userId,
        courseId
      );

    // Returns existing payment if exist and not expired
    if (existingUserPayment)
      return { ...existingUserPayment.dataValues, newPayment: false };

    const expiredAt = new Date();

    expiredAt.setDate(expiredAt.getDate() + 1);

    // Create User Payment
    const payload = {
      user_id: userId,
      course_id: courseId,
      expired_at: expiredAt
    };

    const payment = await paymentRepository.payCourse(payload);

    return { ...payment.dataValues, newPayment: true };
  } catch (err) {
    throw generateApplicationError(err, 'Error while creating payment', 500);
  }
}

/**
 * @param {userPaymentModel.PaymentMethod} paymentMethod
 * @param {string} paymentId
 * @param {string} userId
 */
export async function updatePayCourse(paymentMethod, paymentId, userId) {
  try {
    // CHECK STATUS PAYMENT
    const existingUserPayment =
      await paymentRepository.getUserPaymentStatusById(paymentId);

    if (!existingUserPayment) {
      throw new ApplicationError('Payment not found', 404);
    }

    const isPaymentAlreadyCompleted =
      existingUserPayment.dataValues.status === 'COMPLETED';

    if (isPaymentAlreadyCompleted) {
      throw new ApplicationError('This payment is already completed', 422);
    }

    const isPaymentExpired =
      new Date() > existingUserPayment.dataValues.expired_at;

    if (isPaymentExpired) {
      throw new ApplicationError('This course payment is already expired', 422);
    }

    const courseId = existingUserPayment.dataValues.course_id;

    const courseMaterialIds =
      await courseMaterialRepository.getCourseMaterialByCourseId(courseId);

    const paymentResult = await sequelize.transaction(async (transaction) => {
      // BACKFILL COURSE MATERIAL STATUS
      for (const course_material_id of courseMaterialIds) {
        await courseMaterialStatusRepository.setCourseMaterialStatus(
          {
            user_id: userId,
            course_material_id
          },
          transaction
        );
      }

      // PAYMENT
      const payload = {
        status: 'COMPLETED',
        payment_method: paymentMethod,
        paid_at: new Date()
      };

      const [, [updatedPayment]] = await paymentRepository.updatePayCourse(
        payload,
        paymentId,
        transaction
      );

      // USER COURSE CREATE
      const userCoursePayload = {
        user_id: userId,
        course_id: courseId
      };

      await userCourseRepository.createUserCourse(
        userCoursePayload,
        transaction
      );

      return updatedPayment;
    });

    return paymentResult;
  } catch (error) {
    throw generateApplicationError(error, 'Error while updating payment', 500);
  }
}
