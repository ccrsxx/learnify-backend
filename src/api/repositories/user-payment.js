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
