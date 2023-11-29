import {
  Course,
  CourseChapter,
  CourseMaterial,
  sequelize
} from '../models/index.js';

export function getCourses() {
  return Course.findAll({
    include: ['user', 'course_category']
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
        attributes: [],
        include: [
          {
            model: CourseMaterial,
            as: 'course_material',
            attributes: []
          }
        ]
      }
    ],
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT SUM("duration") FROM "course_chapter" WHERE "course_chapter"."course_id" = "Course"."id")'
          ),
          'total_duration'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "course_material" WHERE "course_material"."course_chapter_id" IN (SELECT "id" FROM "course_chapter" WHERE "course_chapter"."course_id" = "Course"."id"))'
          ),
          'total_materials'
        ]
      ]
    },
    group: ['Course.id', 'course_chapter.id', 'course_category.id']
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
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT SUM("duration") FROM "course_chapter" WHERE "course_chapter"."course_id" = "Course"."id")'
          ),
          'total_duration'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "course_material" WHERE "course_material"."course_chapter_id" IN (SELECT "id" FROM "course_chapter" WHERE "course_chapter"."course_id" = "Course"."id"))'
          ),
          'total_materials'
        ]
      ]
    },
    group: [
      'Course.id',
      'course_chapter.id',
      'course_category.id',
      'course_chapter->course_material.id'
    ]
  });
}

/** @param {string} id */
export function getCourseFullDataById(id) {
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
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT SUM("duration") FROM "course_chapter" WHERE "course_chapter"."course_id" = "Course"."id")'
          ),
          'total_duration'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "course_material" WHERE "course_material"."course_chapter_id" IN (SELECT "id" FROM "course_chapter" WHERE "course_chapter"."course_id" = "Course"."id"))'
          ),
          'total_materials'
        ]
      ]
    },
    group: [
      'Course.id',
      'course_chapter.id',
      'course_category.id',
      'course_chapter->course_material.id'
    ]
  });
}
