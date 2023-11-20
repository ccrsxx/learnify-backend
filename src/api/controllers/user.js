import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.AuthorizedController}
 * @returns {void}
 */
export function getCurrentUser(_req, res) {
  const user = res.locals.user;

  res.status(200).json({ data: user });
}
