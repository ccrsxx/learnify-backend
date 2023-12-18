import Sequelize from 'sequelize';
import { Op } from 'sequelize';
import { User, Course, UserPayment, CourseCategory } from '../models/index.js';
import { getTotalDuration, getTotalMaterials } from './course.js';

/** @param {any} payload */
export function payCourse(payload) {
  return UserPayment.create(payload);
}

/**
 * @param {any} payload
 * @param {string} id
 * @param {Sequelize.Transaction} transaction
 */
export function updatePayCourse(payload, id, transaction) {
  return UserPayment.update(payload, {
    where: { id },
    returning: true,
    transaction: transaction
  });
}

export function getPayments() {
  return UserPayment.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['admin', 'password'] }
      },
      {
        model: Course,
        as: 'course',
        include: [
          {
            model: CourseCategory,
            as: 'course_category'
          }
        ]
      }
    ]
  });
}

/** @param {string} id */
export function getUserPaymentById(id) {
  return UserPayment.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['admin', 'password'] }
      },
      {
        model: Course,
        as: 'course',
        include: [
          {
            model: CourseCategory,
            as: 'course_category'
          }
        ]
      }
    ]
  });
}

/** @param {string} userId */
export function getPaymentsHistory(userId) {
  return UserPayment.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Course,
        as: 'course',
        include: [
          {
            model: CourseCategory,
            as: 'course_category'
          }
        ],
        attributes: {
          include: [getTotalDuration(true), getTotalMaterials(true)]
        }
      }
    ]
  });
}

/**
 * @param {string} userId
 * @param {string} courseId
 */
export function getPendingPaymentByUserIdAndCourseId(userId, courseId) {
  return UserPayment.findOne({
    where: {
      user_id: userId,
      course_id: courseId,
      expired_at: {
        [Op.gt]: new Date()
      }
    }
  });
}
