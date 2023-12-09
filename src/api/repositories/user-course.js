import { UserCourse } from '../models/index.js';

/** @param {any} payload */
export function createUserCourse(payload) {
  return UserCourse.create(payload);
}

/**
 * @param {string} userId
 * @param {string} courseId
 */
export function getUserCourseByUserIdAndCourseId(userId, courseId) {
  return UserCourse.findOne({
    where: { user_id: userId, course_id: courseId }
  });
}
