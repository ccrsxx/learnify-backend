import Sequelize from 'sequelize';
import { Op } from 'sequelize';
import { UserPayment } from '../models/index.js';

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

/** @param {string} id */
export function getUserPaymentStatusById(id) {
  return UserPayment.findOne({
    where: { id }
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
