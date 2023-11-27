import { CourseCategory } from '../models/index.js';

export function getCourseCategories() {
  return CourseCategory.findAll();
}
