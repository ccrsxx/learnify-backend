import Sequelize, { Op } from 'sequelize';
import { User } from '../models/index.js';
import * as Models from '../models/user.js';

/** @param {string} id */
export function getUser(id) {
  return User.findByPk(id, {
    attributes: {
      exclude: ['password']
    }
  });
}

/** @param {string} email */
export function getUserByEmail(email) {
  return User.findOne({
    where: { email, verified: true }
  });
}

/**
 * @param {string} email
 * @param {string} phoneNumber
 */
export function getVerifiedUserWithEmailAndPhoneNumber(email, phoneNumber) {
  return User.findOne({
    where: {
      [Op.or]: [{ email }, { phone_number: phoneNumber }],
      verified: true
    }
  });
}

/**
 * @param {string} email
 * @param {string} phoneNumber
 */
export function getUnverifiedUserByEmailAndPhoneNumber(email, phoneNumber) {
  return User.findOne({
    where: {
      [Op.or]: [{ email }, { phone_number: phoneNumber }],
      verified: false
    }
  });
}

/** @param {string} phoneNumber */
export function getUserByPhoneNumber(phoneNumber) {
  return User.findOne({
    where: { phone_number: phoneNumber, verified: true }
  });
}

/** @param {string} email */
export function getAdminUserByEmail(email) {
  return User.findOne({
    where: { email, admin: true }
  });
}

/** @param {string} phoneNumber */
export function getAdminUserByPhoneNumber(phoneNumber) {
  return User.findOne({
    where: { phone_number: phoneNumber, admin: true }
  });
}

/** @param {Models.UserAttributes} payload */
export function createUser(payload) {
  return User.create(payload);
}

/**
 * @param {string} id
 * @param {Partial<Models.UserAttributes>} payload
 * @param {Sequelize.Transaction} [transaction]
 */
export function updateUser(id, payload, transaction) {
  return User.update(payload, {
    where: { id },
    returning: true,
    transaction: transaction
  });
}

/** @param {string} id */
export function destroyUser(id) {
  return User.destroy({ where: { id } });
}

/**
 * @param {string} id
 * @param {string} newPassword
 */
export function resetPasswordProfile(id, newPassword) {
  return User.update(
    { password: newPassword },
    {
      where: { id },
      returning: true
    }
  );
}
