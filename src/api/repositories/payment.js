import { UserPayment } from '../models/index.js';

/** @param {any} query */
export function payCourse(query) {
  return UserPayment.create(query);
}

// @ts-ignore
export function updatePayCourse(query) {
  return UserPayment.update({ ...query }, { where: { id: query.id } });
}
