import Sequelize from 'sequelize';
import { CourseMaterialStatus } from '../models/index.js';

/**
 * @param {any} payload
 * @param {Sequelize.Transaction} transaction
 */
export function setCourseMaterialStatus(payload, transaction) {
  return CourseMaterialStatus.create(payload, {
    transaction: transaction
  });
}

/** @param {string} id */
export function getCourseMaterialStatusById(id) {
  return CourseMaterialStatus.findByPk(id);
}

/**
 * @param {string} id
 * @param {string} userId
 */
export function getCourseMaterialStatusByUserId(id, userId) {
  return CourseMaterialStatus.findOne({ where: { id, user_id: userId } });
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
