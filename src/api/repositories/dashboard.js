import { User, Course } from '../models/index.js';

export function getStatistics() {
  return Promise.all([
    getTotalUsers(),
    getActiveUsers(),
    getPremiumCourses()
  ]).then(([total_users, active_courses, premium_courses]) => ({
    total_users,
    active_courses,
    premium_courses
  }));
}

export function getTotalUsers() {
  return User.count();
}

export function getActiveUsers() {
  return Course.count();
}

export function getPremiumCourses() {
  return Course.count({
    where: {
      premium: true
    }
  });
}
