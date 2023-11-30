import SequelizeType from 'sequelize';
import {
  Course,
  sequelize,
  CourseChapter,
  CourseMaterial
} from '../models/index.js';

export function getCourses() {
  return Course.findAll({
    include: ['user', 'course_category'],
    attributes: { include: [getTotalDuration(), getTotalMaterials()] }
  });
}

/** @param {any} params */
export function getCourseByFilter(params) {
  return Course.findAll({ where: params });
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

/** @param {string} id */
export function getCourseDataById(id) {
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

/** @returns {SequelizeType.ProjectionAlias} */
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

/** @returns {SequelizeType.ProjectionAlias} */
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
