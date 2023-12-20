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
  return await PasswordReset.findOne({ where: { token } });
}

/** @param {string} id */
export async function updateUsedPasswordResetLink(id) {
  return await PasswordReset.update(
    { used: true },
    { where: { id }, returning: true }
  );
}
