import { CourseChapter } from '../models/index.js';
import * as Models from '../models/course-chapter.js';
import { Op } from 'sequelize';

/** @param {Models.CourseChapterAttributes} payload */
export function createChapter(payload) {
  return CourseChapter.create(payload);
}

/** @param {string} id */
export function getChapterById(id) {
  return CourseChapter.findOne({
    where: { id }
  });
}

/** @param {string} courseId */
export function getChaptersByCourseId(courseId) {
  return CourseChapter.findAll({
    where: { course_id: courseId },
    attributes: ['id']
  });
}

/**
 * @param {Models.CourseChapterAttributes} payload
 * @param {string} chapterId
 */
export function updateChapter(payload, chapterId) {
  return CourseChapter.update(payload, {
    where: { id: chapterId }
  });
}

/** @param {any} ids */
export function destroyChapter(ids) {
  return CourseChapter.destroy({ where: { id: { [Op.in]: ids } } });
}
