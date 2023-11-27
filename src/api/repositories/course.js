import { Course } from '../models/index.js';

export function getCourses() {
  return Course.findAll({
    include: ['user', 'course_category']
  });
}
