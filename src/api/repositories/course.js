import Sequelize from 'sequelize';
import {
  Course,
  sequelize,
  CourseChapter,
  CourseMaterial
} from '../models/index.js';
import * as Types from '../../libs/types/common.js';

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

/** @returns {Sequelize.ProjectionAlias} */
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

/** @returns {Sequelize.ProjectionAlias} */
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

// /** @param {any} query */
// export async function setCourseMaterialStatus(query) {
//   return Course.create(query);
// }
