import Sequelize from 'sequelize';
import { sequelize, CourseMaterial } from '../models/index.js';

/** @param {string} courseId */
export async function getCourseMaterialByCourseId(courseId) {
  const courseMaterials = await sequelize.query(
    `SELECT course_material.id FROM course_material
     JOIN course_chapter ON course_material.course_chapter_id = course_chapter.id 
     WHERE course_chapter.course_id = :course_id`,
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
