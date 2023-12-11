import { User, Course } from '../models/index.js';
export function getTotalUser() {
  return User.count();
}

export function getTotalActiveCourse() {
  return Course.count();
}

export function getTotalPremiumCourse() {
  return Course.count({
    where: {
      premium: true
    }
  });
}
