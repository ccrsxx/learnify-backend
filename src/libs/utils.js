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
