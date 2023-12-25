import { randomBytes } from 'crypto';

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

/**
 * @param {string | string[]} arrayString
 * @returns {any[] | undefined}
 */
export function parseArrayStringToArray(arrayString) {
  if (!arrayString) return undefined;

  const needsParsing = !Array.isArray(arrayString);

  return needsParsing ? JSON.parse(arrayString) : arrayString;
}

export function generateRandomToken() {
  return randomBytes(24).toString('base64url');
}
