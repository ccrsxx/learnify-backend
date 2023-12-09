import { UserPayment } from '../models/index.js';

/** @param {any} payload */
export function payCourse(payload) {
  return UserPayment.create(payload);
}

/**
 * @param {any} payload
 * @param {string} id
 */
export function updatePayCourse(payload, id) {
  return UserPayment.update(payload, { where: { id }, returning: true });
}

/** @param {string} id */
export function getCourseIdByPaymentId(id) {
  return UserPayment.findOne({ where: { id }, attributes: ['course_id'] }).then(
    (model) => model?.dataValues.course_id
  );
}

/** @param {string} id */
export function getUserPaymentStatusById(id) {
  return UserPayment.findOne({
    where: { id }
  });
}
