import { Op } from 'sequelize';
import { PasswordReset } from '../models/index.js';

// @ts-ignore
export async function setPasswordReset(payload) {
  return await PasswordReset.create({
    ...payload,
    created_at: new Date(),
    updated_at: new Date()
  });
}

/** @param {string} token */
export async function getDataPasswordResetByToken(token) {
  return await PasswordReset.findOne({
    where: { token, used: false, expired_at: { [Op.gt]: new Date() } }
  });
}

/** @param {string} token */
export async function updateUsedPasswordResetLink(token) {
  return await PasswordReset.update(
    { used: true },
    { where: { token }, returning: true }
  );
}

/** @param {string} user_id */
export async function setUsedTrueByUserId(user_id) {
  return await PasswordReset.update(
    { used: true },
    { where: { user_id, expired_at: { [Op.gt]: new Date() } }, returning: true }
  );
}
