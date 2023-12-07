import { UserPayment } from '../models/index.js';

/** @param {any} query */
export function payCourse(query) {
  return UserPayment.create(query);
}

/** @param {any} query */
export function updatePayCourse(query) {
  return UserPayment.update({ ...query }, { where: { id: query.id } });
}
