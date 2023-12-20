import { PasswordReset } from '../models/index.js';

// @ts-ignore
export async function setPasswordReset(payload) {
  return await PasswordReset.create({
    ...payload,
    created_at: new Date(),
    updated_at: new Date()
  });
}
