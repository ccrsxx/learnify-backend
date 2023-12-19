import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import { getCourseFilterQuery } from '../../libs/query.js';
import { omitPropertiesFromObject } from '../../libs/utils.js';
import * as courseRepository from '../repositories/course.js';
import * as courseChapterRepository from '../repositories/course-chapter.js';
import * as courseMaterialRepository from '../repositories/course-material.js';

import * as userCourseRepository from '../repositories/user-course.js';
import * as courseMaterialStatusRepository from '../repositories/course-material-status.js';
import * as Models from '../models/course.js';
import * as Types from '../../libs/types/common.js';
import { Course, CourseChapter, CourseMaterial } from '../models/index.js';

/** @param {Types.RequestQuery} params */
export async function getCourses(params) {
  try {
    const queryFilters = await getCourseFilterQuery(params);

    // @ts-ignore
    const sortByNewest = params.filter?.includes?.('new');

    const courses = await (queryFilters
      ? courseRepository.getCoursesByFilter(queryFilters, sortByNewest)
      : courseRepository.getCourses());

    return courses;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting courses', 500);
  }
}

/** @param {string} id */
export async function getUserCourses(id) {
  try {
    const userCourses = await courseRepository.getUserCourses(id);

    return userCourses;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting courses', 500);
  }
}

/**
 * @param {string} id
 * @param {string | null} [userId=null] Default is `null`
 */
export async function getCourseById(id, userId = null) {
  try {
    let course;

    // Check if user is logged in
    if (userId) {
      // Check if user is enrolled in course
      const existingUserCourse =
        await userCourseRepository.getUserCourseByUserIdAndCourseId(userId, id);

      if (existingUserCourse) {
        course = await courseRepository.getCourseWithUserStatus(id, userId);
      }
    }

    // If user is not logged in or not enrolled in course
    if (!course) {
      course = await courseRepository.getCourseById(id);
    }

    // If course is not found
    if (!course) {
      throw new ApplicationError('Course not found', 404);
    }

    return course;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting course details',
      500
    );
  }
}

/**
 * @param {Models.CourseAttributes} payload
 * @param {string} userId
 */
export async function createCourse(payload, userId) {
  const parsedPayload = omitPropertiesFromObject(payload, [
    'id',
    'created_at',
    'updated_at'
  ]);

  // @ts-ignore
  const { target_audience, course_chapter } = payload;

  const parsedPayloadWithCategoryAndUser =
    /** @type {Models.CourseAttributes} */ ({
      ...parsedPayload,
      /**
       * Parse target_audience from string to Array of string, because array
       * that is sent from client with form-data will get converted to string
       */
      ...(target_audience && {
        target_audience: JSON.parse(
          /** @type {string} */ (/** @type {unknown} */ (target_audience))
        )
      }),
      user_id: userId
    });

  try {
    const course = await courseRepository.createCourse(
      parsedPayloadWithCategoryAndUser
    );
    for (const chapter of course_chapter) {
      const { course_material } = chapter;

      // Create the chapter
      const newChapter = await courseChapterRepository.createChapter({
        ...chapter,
        // @ts-ignore
        course_id: course.id
      });

      // Create the chapter materials
      for (const material of course_material) {
        await courseMaterialRepository.createMaterial({
          ...material,
          // @ts-ignore
          course_chapter_id: newChapter.id
        });
      }
    }

    return course;
  } catch (err) {
    throw generateApplicationError(err, 'Error while creating course', 500);
  }
}

/**
 * @param {Models.CourseAttributes} payload
 * @param {string} id
 */
export async function updateCourse(id, payload) {
  // @ts-ignore
  const { course_chapter } = payload;
  try {
    const course = await Course.findByPk(id);

    // If course is not found
    if (!course) {
      throw new ApplicationError('Course not found', 404);
    }

    // Retrieve the list of chapters from the database
    const existingChapters = await CourseChapter.findAll({
      where: { course_id: id },
      attributes: ['id']
    });

    // Delete any chapters that are in the database but not in the payload
    // @ts-ignore
    const chapterIdsInPayload = course_chapter.map((chapter) => chapter.id);
    const chapterIdsToDelete = existingChapters
      // @ts-ignore
      .filter((chapter) => !chapterIdsInPayload.includes(chapter.id))
      // @ts-ignore
      .map((chapter) => chapter.id);
    await CourseChapter.destroy({ where: { id: chapterIdsToDelete } });

    await course.update(payload);

    for (const chapter of course_chapter) {
      const { id: chapterId, course_material } = chapter;

      // Retrieve the list of chapters from the database
      const existingMaterials = await CourseMaterial.findAll({
        where: { course_chapter_id: chapterId },
        attributes: ['id']
      });

      // Delete any materials that are in the database but not in the payload
      const materialIdsInPayload = course_material.map(
        // @ts-ignore
        (material) => material.id
      );
      const materialIdsToDelete = existingMaterials
        // @ts-ignore
        .filter((material) => !materialIdsInPayload.includes(material.id))
        // @ts-ignore
        .map((material) => material.id);
      await CourseMaterial.destroy({ where: { id: materialIdsToDelete } });

      const courseChapter = await CourseChapter.findByPk(chapterId);

      if (courseChapter) {
        await courseChapter.update(chapter);

        for (const material of course_material) {
          const { id: materialId } = material;

          const courseMaterial = await CourseMaterial.findByPk(materialId);

          if (courseMaterial) {
            await courseMaterial.update(material);
          } else {
            const newMaterial = await CourseMaterial.create(material);
            await courseMaterialStatusRepository.backfillCourseMaterialStatus(
              id,
              newMaterial.dataValues.id
            );
          }
        }
      } else {
        const newChapter = await CourseChapter.create(chapter);

        for (const material of course_material) {
          const newMaterial = await CourseMaterial.create({
            ...material,
            course_chapter_id: newChapter.dataValues.id
          });
          await courseMaterialStatusRepository.backfillCourseMaterialStatus(
            id,
            newMaterial.dataValues.id
          );
        }
      }
    }

    const updatedCourse = await courseRepository.getCourseById(id);

    return updatedCourse;
  } catch (err) {
    throw generateApplicationError(err, 'Error while updating course', 500);
  }
}

/** @param {string} id */
export async function destroyCourse(id) {
  try {
    return await courseRepository.destroyCourse(id);
  } catch (err) {
    throw generateApplicationError(err, 'Error while deleting course', 500);
  }
}
