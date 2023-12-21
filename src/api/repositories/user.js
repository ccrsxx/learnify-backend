import Sequelize from 'sequelize';
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
    where: { email }
  });
}

/** @param {string} phoneNumber */
export function getUserByPhoneNumber(phoneNumber) {
  return User.findOne({
    where: { phone_number: phoneNumber }
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
