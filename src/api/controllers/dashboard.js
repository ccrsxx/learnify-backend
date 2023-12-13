import { ApplicationError } from '../../libs/error.js';
import * as dashboardService from '../services/dashboard.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function getStatistics(_req, res) {
  try {
    const data = await dashboardService.getStatistics();
    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
