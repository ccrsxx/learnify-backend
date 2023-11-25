import { CourseCategory } from '../models/index.js';

export function listCourseCategories() {
  return CourseCategory.findAll();
}
