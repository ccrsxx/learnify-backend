import { generateApplicationError } from '../../libs/error.js';
import * as dashboardRepositories from '../repositories/dashboard.js';

export async function getStatistics() {
  try {
    const data = await dashboardRepositories.getStatistics();
    return data;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting statistics', 500);
  }
}
