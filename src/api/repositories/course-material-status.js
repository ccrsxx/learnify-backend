import Sequelize from 'sequelize';
import {
  User,
  sequelize,
  UserCourse,
  CourseMaterialStatus
} from '../models/index.js';
/**
 * @param {any} payload
 * @param {Sequelize.Transaction} transaction
 */
export function setCourseMaterialStatus(payload, transaction) {
  return CourseMaterialStatus.create(payload, {
    transaction: transaction
  });
}

/** @param {string} id */
export function getCourseMaterialStatusById(id) {
  return CourseMaterialStatus.findByPk(id);
}

/**
 * @param {string} courseId
 * @param {string} courseMaterialId
 */
export async function backfillCourseMaterialStatus(courseId, courseMaterialId) {
  const users = await User.findAll({
    include: [
      {
        model: UserCourse,
        where: { course_id: courseId }
      }
    ]
  });

  await sequelize.transaction(async (transaction) => {
    for (const user of users) {
      await setCourseMaterialStatus(
        {
          user_id: user.dataValues.id,
          course_material_id: courseMaterialId
        },
        transaction
      );
    }
  });
}

/** @param {string} id */
export function updateCourseMaterialStatus(id) {
  return CourseMaterialStatus.update(
    { completed: true },
    {
      where: { id: id },
      returning: true
    }
  );
}
