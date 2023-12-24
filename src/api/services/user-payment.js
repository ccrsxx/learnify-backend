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
import * as CourseModel from '../models/course.js';
import * as UserNotificationService from '../services/user-notification.js';

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

/** @param {string} userId */
export async function getPaymentsHistory(userId) {
  try {
    const payments = await paymentRepository.getPaymentsHistory(userId);

    return payments;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting payments History',
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

      await UserNotificationService.createUserNotification(userId, {
        name: 'Kelas',
        description: `Kamu berhasil masuk di kelas ${existingUserPayment.course.name}`
      });

      return updatedPayment;
    });

    return paymentResult;
  } catch (error) {
    throw generateApplicationError(error, 'Error while updating payment', 500);
  }
}

/**
 * @param {CourseModel.CourseAttributes} course
 * @param {string} userId
 */
export async function paymentFreePass(course, userId) {
  try {
    const { id: courseId } = course;

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

    const courseMaterialIds =
      await courseMaterialRepository.getCourseMaterialByCourseId(courseId);

    await sequelize.transaction(async (transaction) => {
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

      // USER COURSE CREATE
      const userCoursePayload = {
        user_id: userId,
        course_id: courseId
      };

      await userCourseRepository.createUserCourse(
        userCoursePayload,
        transaction
      );

      await UserNotificationService.createUserNotification(userId, {
        name: 'Kelas',
        description: `Kamu berhasil masuk di kelas ${course.name}`
      });
    });
  } catch (error) {
    throw generateApplicationError(error, 'Error while enrolling course', 500);
  }
}

// @ts-ignore
export async function isCourseFree(courseId) {
  try {
    const isFree = await paymentRepository.isCourseFree(courseId);

    if (isFree) {
      throw new ApplicationError(
        'Payment is not required on free courses',
        422
      );
    }

    return isFree;
  } catch (err) {
    throw generateApplicationError(err, 'Error while comparing course', 500);
  }
}

// @ts-ignore
export async function isCoursePremium(course) {
  const { id } = course;

  try {
    const isPremium = await paymentRepository.isCoursePremium(id);

    if (isPremium) {
      throw new ApplicationError('Make payment to enroll premium courses', 422);
    }

    return isPremium;
  } catch (err) {
    throw generateApplicationError(err, 'Error while comparing course', 500);
  }
}
