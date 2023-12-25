import Sequelize from 'sequelize';
import {
  Course,
  sequelize,
  UserCourse,
  CourseChapter,
  CourseMaterial,
  CourseCategory,
  CourseMaterialStatus
} from '../models/index.js';
import * as Types from '../../libs/types/common.js';
import * as Models from '../models/course.js';

export function getCourses() {
  return Course.findAll({
    include: ['course_category'],
    attributes: { include: [getTotalDuration(), getTotalMaterials()] }
  });
}

export function getCoursesWithDetails() {
  return Course.findAll({
    order: [
      ['created_at', 'DESC'],
      ['course_chapter', 'order_index', 'ASC'],
      ['course_chapter', 'course_material', 'order_index', 'ASC']
    ],
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
    ]
  });
}

/**
 * @param {Types.WhereOptions<Course>} whereOptions
 * @param {boolean} [sortByNewest=false] Default is `false`
 */
export async function getCoursesByFilter(whereOptions, sortByNewest = false) {
  return Course.findAll({
    where: whereOptions,
    include: ['course_category'],
    ...(sortByNewest && { order: [['created_at', 'DESC']] }),
    attributes: { include: [getTotalDuration(), getTotalMaterials()] }
  });
}

/** @param {string} userId */
export function getUserCourses(userId) {
  return Course.findAll({
    include: [
      {
        model: UserCourse,
        as: 'user_course',
        where: { user_id: userId },
        attributes: []
      },
      {
        model: CourseCategory,
        as: 'course_category'
      }
    ],
    attributes: {
      include: [
        getTotalDuration(),
        getTotalMaterials(),
        getUserTotalCompletedMaterials()
      ]
    },
    replacements: { user_id: userId }
  });
}

/**
 * @param {string} userId
 * @param {Types.WhereOptions<Course>} whereOptions
 * @param {boolean} [sortByNewest=false] Default is `false`
 */
export function getUserCoursesWithFilter(userId, whereOptions, sortByNewest) {
  return Course.findAll({
    where: whereOptions,
    include: [
      {
        model: UserCourse,
        as: 'user_course',
        where: { user_id: userId },
        attributes: []
      },
      {
        model: CourseCategory,
        as: 'course_category'
      }
    ],
    ...(sortByNewest && { order: [['created_at', 'DESC']] }),
    attributes: {
      include: [
        getTotalDuration(),
        getTotalMaterials(),
        getUserTotalCompletedMaterials()
      ]
    },
    replacements: { user_id: userId }
  });
}

/** @param {string} id */
export function getNonVideoCourseById(id) {
  return Course.findByPk(id, {
    include: [
      'course_category',
      {
        model: CourseChapter,
        as: 'course_chapter',
        include: [
          {
            model: CourseMaterial,
            as: 'course_material',
            attributes: {
              exclude: ['video']
            }
          }
        ]
      }
    ],
    order: [
      ['course_chapter', 'order_index', 'ASC'],
      ['course_chapter', 'course_material', 'order_index', 'ASC']
    ],
    attributes: {
      include: [getTotalDuration(), getTotalMaterials()],
      exclude: ['intro_video']
    }
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
    order: [
      ['course_chapter', 'order_index', 'ASC'],
      ['course_chapter', 'course_material', 'order_index', 'ASC']
    ],
    attributes: { include: [getTotalDuration(), getTotalMaterials()] }
  });
}

/**
 * @param {string} id
 * @param {string} userId
 */
export function getCourseWithUserStatus(id, userId) {
  return Course.findByPk(id, {
    include: [
      'course_category',
      {
        model: CourseChapter,
        as: 'course_chapter',
        include: [
          {
            model: CourseMaterial,
            as: 'course_material',
            include: [
              {
                model: CourseMaterialStatus,
                as: 'course_material_status',
                where: { user_id: userId }
              }
            ]
          }
        ]
      },
      {
        model: UserCourse,
        as: 'user_course',
        where: { user_id: userId }
      }
    ],
    order: [
      ['course_chapter', 'order_index', 'ASC'],
      ['course_chapter', 'course_material', 'order_index', 'ASC']
    ],
    attributes: {
      include: [
        getTotalDuration(),
        getTotalMaterials(),
        getUserTotalCompletedMaterials()
      ]
    },
    replacements: { user_id: userId }
  });
}

/** @param {any} payload */
export function createCourse(payload) {
  return Course.create(payload, {
    include: [
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
    ]
  });
}

/**
 * @param {string} id
 * @param {Partial<Models.CourseAttributes>} payload
 */
export function updateCourse(id, payload) {
  return Course.update(payload, {
    where: { id },
    returning: true
  });
}

/** @param {string} id */
export function destroyCourse(id) {
  return Course.destroy({ where: { id } });
}

/** @returns {Sequelize.ProjectionAlias} */
export function getTotalDuration(fromUserPaymentModel = false) {
  const referencedCourseIdFrom = fromUserPaymentModel
    ? '"UserPayment".course_id'
    : '"Course".id';

  return [
    sequelize.cast(
      sequelize.literal(
        `(
          SELECT SUM(cc.duration)
          
          FROM course_chapter as cc

          WHERE cc.course_id = ${referencedCourseIdFrom}
        )`
      ),
      'integer'
    ),
    'total_duration'
  ];
}

/** @returns {Sequelize.ProjectionAlias} */
export function getTotalMaterials(fromUserPaymentModel = false) {
  const referencedCourseIdFrom = fromUserPaymentModel
    ? '"UserPayment".course_id'
    : '"Course".id';

  return [
    sequelize.cast(
      sequelize.literal(
        `(
          SELECT COUNT(*)

          FROM course_material AS cm

          JOIN course_chapter AS cc
            ON cm.course_chapter_id = cc.id

          JOIN course AS c
            ON cc.course_id = c.id

          WHERE c.id = ${referencedCourseIdFrom}
        )`
      ),
      'integer'
    ),
    'total_materials'
  ];
}

/** @returns {Sequelize.ProjectionAlias} */
function getUserTotalCompletedMaterials() {
  return [
    sequelize.cast(
      sequelize.literal(
        `(
          SELECT COUNT(*)

          FROM course_material_status AS cms

          JOIN course_material AS cm
            ON cms.course_material_id = cm.id

          JOIN course_chapter AS cc
            ON cm.course_chapter_id = cc.id

          JOIN course AS c
            ON cc.course_id = c.id

          WHERE cms.user_id = :user_id
            AND cms.completed = true
            AND c.id = "Course".id
        )`
      ),
      'integer'
    ),
    'total_completed_materials'
  ];
}
