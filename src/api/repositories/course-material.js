import Sequelize from 'sequelize';
import { sequelize, CourseMaterial } from '../models/index.js';
import * as Models from '../models/course-material.js';
import { Op } from 'sequelize';

/** @param {Models.CourseMaterialAttributes} payload */
export function createMaterial(payload) {
  return CourseMaterial.create(payload);
}

/**
 * @param {Models.CourseMaterialAttributes} payload
 * @param {string} materialId
 */
export function updateMaterial(payload, materialId) {
  return CourseMaterial.update(payload, {
    where: { id: materialId }
  });
}

/** @param {string} id */
export function getMaterialById(id) {
  return CourseMaterial.findOne({
    where: { id }
  });
}

/** @param {string} chapterId */
export function getMaterialsByChapterId(chapterId) {
  return CourseMaterial.findAll({
    where: { course_chapter_id: chapterId },
    attributes: ['id']
  });
}

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

/** @param {string[]} ids */
export function destroyMaterial(ids) {
  return CourseMaterial.destroy({ where: { id: { [Op.in]: ids } } });
}
