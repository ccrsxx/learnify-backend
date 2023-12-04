import sequelize from 'sequelize';
import { Course, CourseChapter, CourseMaterial } from '../models/index.js';
import * as Types from '../../libs/types/common.js';
import * as Models from '../models/course.js';

export function getCourses() {
  return Course.findAll({
    include: ['user', 'course_category'],
    attributes: { include: [getTotalDuration(), getTotalMaterials()] }
  });
}

/**
 * @param {Types.WhereOptions<Course>} whereOptions
 * @param {boolean} [sortByNewest=false] Default is `false`
 */
export async function getCoursesByFilter(whereOptions, sortByNewest = false) {
  return Course.findAll({
    where: whereOptions,
    include: ['user', 'course_category'],
    ...(sortByNewest && { order: [['created_at', 'DESC']] }),
    attributes: { include: [getTotalDuration(), getTotalMaterials()] }
  });
}

/** @param {string} id */
export function getCourseById(id) {
  return Course.findByPk(id, {
    include: [
      'course_category',
      {
        model: CourseChapter,
        as: 'course_chapter',
        include: [
          {
            model: CourseMaterial,
            as: 'course_material'
          }
        ]
      }
    ],
    attributes: { include: [getTotalDuration(), getTotalMaterials()] }
  });
}

/** @param {Models.CourseAttributes} payload */
export function createCourse(payload) {
  console.log(payload);
  return Course.create(payload);
}

/** @returns {sequelize.ProjectionAlias} */
function getTotalDuration() {
  return [
    sequelize.cast(
      sequelize.literal(
        `(
          SELECT SUM(duration) FROM course_chapter
          WHERE course_chapter.course_id = "Course".id
        )`
      ),
      'integer'
    ),
    'total_duration'
  ];
}

/** @returns {sequelize.ProjectionAlias} */
function getTotalMaterials() {
  return [
    sequelize.cast(
      sequelize.literal(
        `(
          SELECT COUNT(*) FROM course_material
          WHERE course_material.course_chapter_id
          IN (
            SELECT id FROM course_chapter
            WHERE course_chapter.course_id = "Course".id
          )
         )`
      ),
      'integer'
    ),
    'total_materials'
  ];
}
