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

export async function getPayments() {
  try {
    const payments = await paymentRepository.getPayments();

    return payments;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting payments', 500);
  }
}

/** @param {string} id */
export async function getUserPaymentById(id) {
  try {
    const payment = await paymentRepository.getUserPaymentById(id);

    if (!payment) {
      throw new ApplicationError('Payment not found', 404);
    }

    return payment;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting payment details',
      500
    );
  }
}

/**
 * @param {string} courseId
 * @param {string} userId
 */
export async function payCourse(courseId, userId) {
  try {
    // CHECK IF COURSE IS ENROLLED
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

    // CHECK EXISTING USER PAYMENT AND EXPIRED AT
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

    // CREATE USER PAYMENT
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
 * @param {any} existingUserPayment
 * @param {userPaymentModel.PaymentMethod} paymentMethod
 * @param {string} paymentId
 * @param {string} userId
 */
export async function updatePayCourse(
  existingUserPayment,
  paymentMethod,
  paymentId,
  userId
) {
  try {
    if (!paymentMethod) {
      throw new ApplicationError('Payment method cannot be null', 400);
    }

    // CHECK STATUS PAYMENT
    const isPaymentAlreadyCompleted =
      existingUserPayment.status === 'COMPLETED';

    if (isPaymentAlreadyCompleted) {
      throw new ApplicationError('This payment is already completed', 422);
    }

    const isPaymentExpired = new Date() > existingUserPayment.expired_at;

    if (isPaymentExpired) {
      throw new ApplicationError('This course payment is already expired', 422);
    }

    const courseId = existingUserPayment.course_id;

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
