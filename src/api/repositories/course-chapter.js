import { CourseChapter } from '../models/index.js';
import * as Models from '../models/course-chapter.js';

/** @param {Models.CourseChapterAttributes} payload */
export function createChapter(payload) {
  return CourseChapter.create(payload);
}
