import { UserPayment } from '../models/index.js';

/** @param {any} query */
export function payCourse(query) {
  return UserPayment.create(query);
}
