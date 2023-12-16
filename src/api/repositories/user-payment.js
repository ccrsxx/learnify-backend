import Sequelize from 'sequelize';
import { Op } from 'sequelize';
import {
  UserPayment,
  User,
  Course,
  CourseCategory,
  sequelize
} from '../models/index.js';

/** @param {any} payload */
export function payCourse(payload) {
  return UserPayment.create(payload);
}

/**
 * @param {any} payload
 * @param {string} id
 * @param {Sequelize.Transaction} transaction
 */
export function updatePayCourse(payload, id, transaction) {
  return UserPayment.update(payload, {
    where: { id },
    returning: true,
    transaction: transaction
  });
}

export function getPayments() {
  return UserPayment.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['admin', 'password'] }
      },
      {
        model: Course,
        as: 'course',
        include: [
          {
            model: CourseCategory,
            as: 'course_category'
          }
        ]
      }
    ]
  });
}

/** @param {string} id */
export function getUserPaymentById(id) {
  return UserPayment.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['admin', 'password'] }
      },
      {
        model: Course,
        as: 'course',
        include: [
          {
            model: CourseCategory,
            as: 'course_category'
          }
        ]
      }
    ]
  });
}

/** @param {string} userId */
export function getPaymentsHistory(userId) {
  return UserPayment.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Course,
        as: 'course',
        include: [
          {
            model: CourseCategory,
            as: 'course_category'
          }
        ],
        attributes: { include: [getTotalDuration(), getTotalMaterials()] }
      }
    ]
  });
}

/**
 * @param {string} userId
 * @param {string} courseId
 */
export function getPendingPaymentByUserIdAndCourseId(userId, courseId) {
  return UserPayment.findOne({
    where: {
      user_id: userId,
      course_id: courseId,
      expired_at: {
        [Op.gt]: new Date()
      }
    }
  });
}

/** @returns {Sequelize.ProjectionAlias} */
function getTotalDuration() {
  return [
    sequelize.cast(
      sequelize.literal(
        `(
          SELECT SUM(cc.duration)

          FROM course_chapter as cc

          WHERE cc.course_id = "course".id
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
          SELECT COUNT(*)

          FROM course_material AS cm

          JOIN course_chapter AS cc
            ON cm.course_chapter_id = cc.id

          JOIN course AS c
            ON cc.course_id = c.id

          WHERE c.id = "course".id
        )`
      ),
      'integer'
    ),
    'total_materials'
  ];
}
