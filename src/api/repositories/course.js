import { Course, CourseChapter } from '../models/index.js';

export function getCourses() {
  return Course.findAll({
    include: ['user', 'course_category']
  });
}

/** @param {string} id */
export function getCourseById(id) {
  return Course.findByPk(id, {
    include: [
      'user',
      'course_category',
      {
        model: CourseChapter,
        as: 'chapters'
      }
    ]
  });
}
