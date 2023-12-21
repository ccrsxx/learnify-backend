import Sequelize, { Op } from 'sequelize';
import { PasswordReset } from '../models/index.js';

/**
 * @param {any} payload
 * @param {Sequelize.Transaction} transaction
 */
export async function setPasswordReset(payload, transaction) {
  return PasswordReset.create(payload, { transaction: transaction });
}

/** @param {string} token */
export async function getDataPasswordResetByToken(token) {
  return PasswordReset.findOne({
    where: { token, used: false, expired_at: { [Op.gt]: new Date() } }
  });
}

/**
 * @param {string} token
 * @param {Sequelize.Transaction} transaction
 */
export async function updateUsedPasswordResetLink(token, transaction) {
  return PasswordReset.update(
    { used: true },
    { where: { token }, transaction: transaction }
  );
}

/**
 * @param {string} user_id
 * @param {Sequelize.Transaction} transaction
 */
export async function setUsedTrueByUserId(user_id, transaction) {
  return PasswordReset.update(
    { used: true },
    {
      where: { user_id, expired_at: { [Op.gt]: new Date() } },
      transaction: transaction
    }
  );
}
