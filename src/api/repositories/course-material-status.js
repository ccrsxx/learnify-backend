import { CourseMaterialStatus } from '../models/index.js';

/** @param {any} payload */
export function setCourseMaterialStatus(payload) {
  return CourseMaterialStatus.create(payload);
}
