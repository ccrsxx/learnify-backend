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
