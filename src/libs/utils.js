import { randomBytes, randomInt } from 'crypto';

/**
 * Remove a property from an object.
 *
 * @template {object} T
 * @template {keyof T} U
 * @param {T} object
 * @param {U[]} properties
 * @returns {Omit<T, U>}
 */
export function omitPropertiesFromObject(object, properties) {
  const newObject = { ...object };

  for (const property of properties) {
    delete newObject[property];
  }

  return newObject;
}

/**
 * Pick a property from an object.
 *
 * @template {object} T
 * @template {keyof T} U
 * @param {T} object
 * @param {U[]} properties
 * @returns {Pick<T, U>}
 */
export function pickPropertiesFromObject(object, properties) {
  const newObject = /** @type {T} */ ({});

  for (const property of properties) {
    newObject[property] = object[property];
  }

  return newObject;
}

export function generateRandomToken() {
  return randomBytes(24).toString('base64url');
}

export function generateRandomOTP() {
  return randomInt(100_000, 1_000_000);
}
