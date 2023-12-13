import { CourseMaterialStatus } from '../models/index.js';

/** @param {string} id */
export function getCourseMaterialStatusById(id) {
  return CourseMaterialStatus.findByPk(id);
}

/** @param {string} id */
export function updateCourseMaterialStatus(id) {
  return CourseMaterialStatus.update(
    { completed: true },
    {
      where: { id: id },
      returning: true
    }
  );
}
