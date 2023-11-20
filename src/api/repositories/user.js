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

/** @param {Models.UserAttributes} payload */
export function createUser(payload) {
  return User.create(payload);
}

/**
 * @param {string} id
 * @param {Partial<Models.UserAttributes>} payload
 */
export function updateUser(id, payload) {
  return User.update(payload, {
    where: { id },
    returning: true
  });
}

/** @param {string} id */
export function destroyUser(id) {
  return User.destroy({ where: { id } });
}
