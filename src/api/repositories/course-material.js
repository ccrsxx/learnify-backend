import Sequelize from 'sequelize';
import { sequelize, CourseMaterial } from '../models/index.js';

/** @param {string} courseId */
export async function getCourseMaterialByCourseId(courseId) {
  const courseMaterials = await sequelize.query(
    `(
      SELECT cm.id
      
      FROM course_material as cm

      JOIN course_chapter as cc
        ON cm.course_chapter_id = cc.id

      WHERE cc.course_id = :course_id
    )`,
    {
      type: Sequelize.QueryTypes.SELECT,
      model: CourseMaterial,
      replacements: { course_id: courseId }
    }
  );

  const courseMaterialsIds = courseMaterials.map(
    ({ dataValues: { id } }) => id
  );

  return courseMaterialsIds;
}
