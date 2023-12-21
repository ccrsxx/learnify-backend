import { Op } from 'sequelize';
import { PasswordReset } from '../models/index.js';

/** @param {any} payload */
export async function setPasswordReset(payload) {
  return PasswordReset.create(payload);
}

/** @param {string} token */
export async function getDataPasswordResetByToken(token) {
  return PasswordReset.findOne({
    where: { token, used: false, expired_at: { [Op.gt]: new Date() } }
  });
}

/** @param {string} token */
export async function updateUsedPasswordResetLink(token) {
  return PasswordReset.update(
    { used: true },
    { where: { token }, returning: true }
  );
}

/** @param {string} user_id */
export async function setUsedTrueByUserId(user_id) {
  return PasswordReset.update(
    { used: true },
    { where: { user_id, expired_at: { [Op.gt]: new Date() } }, returning: true }
  );
}
