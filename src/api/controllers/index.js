import { PUBLIC_URL } from '../../libs/env.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Controller}
 * @returns {void}
 */
export function ping(_req, res) {
  res.status(200).json({
    message: 'Ping successfully',
    documentation: `${PUBLIC_URL}/docs`
  });
}
