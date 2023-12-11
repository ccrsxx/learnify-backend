import { generateApplicationError } from '../../libs/error.js';
import {
  getTotalActiveCourse,
  getTotalPremiumCourse,
  getTotalUser
} from '../repositories/statistic.js';

export async function getStatistic() {
  try {
    const data = {
      total_users: await getTotalUser(),
      active_courses: await getTotalActiveCourse(),
      premium_courses: await getTotalPremiumCourse()
    };
    return data;
  } catch (err) {
    throw generateApplicationError(err, 'Failed to count data', 500);
  }
}
