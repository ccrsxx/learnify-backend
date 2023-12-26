import Sequelize, { Op } from 'sequelize';
import { Otp } from '../models/index.js';

/**
 * @param {any} payload
 * @param {Sequelize.Transaction} transaction
 * @returns
 */
export async function setOtpVerification(payload, transaction) {
  return Otp.create(payload, { transaction: transaction });
}

/**
 * @param {string} user_id
 * @param {Sequelize.Transaction} transaction
 */
export async function setUsedTrueByUserId(user_id, transaction) {
  return Otp.update(
    { used: true },
    {
      where: { user_id, expired_at: { [Op.gt]: new Date() } },
      transaction: transaction
    }
  );
}

/**
 * @param {string} otp
 * @param {string} email
 */
export async function getDataOtpVerificationByOtp(otp, email) {
  return Otp.findOne({
    where: { otp, used: false, expired_at: { [Op.gt]: new Date() } },
    include: [
      {
        association: 'user',
        where: { email, verified: false },
        attributes: []
      }
    ]
  });
}

/**
 * @param {string} otp
 * @param {string} user_id
 * @param {Sequelize.Transaction} transaction
 */
export async function updateUsedOtpVerification(otp, user_id, transaction) {
  return Otp.update(
    { used: true },
    {
      where: { user_id, otp, expired_at: { [Op.gt]: new Date() } },
      transaction: transaction
    }
  );
}
