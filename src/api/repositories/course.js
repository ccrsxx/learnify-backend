import sequelize, { Op } from 'sequelize';
import {
  Course,
  CourseChapter,
  CourseMaterial,
  CourseCategory
} from '../models/index.js';

export function getCourses() {
  return Course.findAll({
    include: ['user', 'course_category'],
    attributes: { include: [getTotalDuration(), getTotalMaterials()] }
  });
}

/** @param {any} params */
export async function getCourseByFilter(params) {
  const { type, filter, category, difficulty, search } = params || {};
  const whereClause = {};

  if (type) {
    if (type !== 'all') {
      if (type === 'free') {
        whereClause.premium = false;
      } else if (type === 'premium') {
        whereClause.premium = true;
      }
    }
  }
  if (filter) {
    whereClause.filter = filter.map(String);
  }
  if (category) {
    const categoryNames = category.map(String);
    const categories = await CourseCategory.findAll({
      where: { name: categoryNames },
      attributes: ['id']
    });
    // @ts-ignore
    const categoryIds = categories.map((category) => category.id);
    whereClause.course_category_id = categoryIds;
  }
  if (difficulty) {
    if (!difficulty.includes('all')) {
      // @ts-ignore
      whereClause.difficulty = difficulty.map((level) => level.toUpperCase());
    }
  }
  if (search) {
    whereClause.name = { [Op.iLike]: `%${search.toLowerCase()}%` };
  }

  return Course.findAll({
    // @ts-ignore
    where: whereClause,
    include: ['user', 'course_category'],
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
