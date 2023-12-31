import {
  ApplicationError,
  generateApplicationError
} from '../../libs/error.js';
import { getCourseFilterQuery } from '../../libs/query.js';
import {
  parseArrayStringToArray,
  omitPropertiesFromObject
} from '../../libs/utils.js';
import * as courseRepository from '../repositories/course.js';
import * as courseChapterRepository from '../repositories/course-chapter.js';
import * as courseMaterialRepository from '../repositories/course-material.js';
import * as userCourseRepository from '../repositories/user-course.js';
import * as courseMaterialStatusRepository from '../repositories/course-material-status.js';
import * as Types from '../../libs/types/common.js';

/**
 * @param {Types.RequestQuery} params
 * @param {boolean} admin
 */
export async function getCourses(params, admin = false) {
  try {
    const queryFilters = await getCourseFilterQuery(params);

    let courses;

    const usingAdminCourses = admin && params.admin === 'true';

    if (usingAdminCourses) {
      courses = await courseRepository.getCoursesWithDetails();
    } else if (queryFilters) {
      // @ts-ignore
      const sortByNewest = params.filter?.includes?.('new');

      courses = await courseRepository.getCoursesByFilter(
        queryFilters,
        sortByNewest
      );
    } else courses = await courseRepository.getCourses();

    return courses;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting courses', 500);
  }
}

/**
 * @param {string} id
 * @param {Types.RequestQuery} params
 */
export async function getUserCourses(id, params) {
  try {
    const queryFilters = await getCourseFilterQuery(params);

    // @ts-ignore
    const sortByNewest = params.filter?.includes?.('new');

    let userCourses = await (queryFilters
      ? courseRepository.getUserCoursesWithFilter(
          id,
          queryFilters,
          sortByNewest
        )
      : courseRepository.getUserCourses(id));

    // @ts-ignore
    const trimmedMyCourseType = params.type?.trim?.();

    const hasMyCourseTypeFilter =
      trimmedMyCourseType &&
      ['ongoing', 'completed'].includes(trimmedMyCourseType);

    if (hasMyCourseTypeFilter) {
      userCourses = userCourses.filter(
        ({ dataValues: { total_materials, total_completed_materials } }) => {
          const isOngoing = total_materials > total_completed_materials;
          const isCompleted = total_materials === total_completed_materials;

          return trimmedMyCourseType === 'ongoing' ? isOngoing : isCompleted;
        }
      );
    }

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
    /** @type {Awaited<ReturnType<typeof courseRepository.getCourseById>>} */
    let course = null;

    if (userId) {
      const existingUserCourse =
        await userCourseRepository.getUserCourseByUserIdAndCourseId(userId, id);

      // If logged in user has bought the course
      if (existingUserCourse) {
        course = await courseRepository.getCourseWithUserStatus(id, userId);
      } else {
        // If logged in user has not bought the course
        course = await courseRepository.getCourseById(id);

        const courseIsPremium = course?.dataValues?.premium;

        if (courseIsPremium) {
          // Remove video from all materials except the first chapter on premium course
          course?.dataValues.course_chapter.forEach(
            ({ dataValues: { order_index, course_material } }) => {
              if (order_index > 1) {
                course_material.forEach(
                  ({ dataValues }) => delete dataValues.video
                );
              }
            }
          );
        }
      }
    } else {
      // If user is not logged in
      course = await courseRepository.getNonVideoCourseById(id);
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
 * @param {any} payload
 * @param {string} userId
 */
export async function createCourse(payload, userId) {
  const parsedPayload = omitPropertiesFromObject(payload, [
    'id',
    'created_at',
    'updated_at'
  ]);

  const { target_audience, course_chapter } = payload;

  const parsedPayloadWithCategoryAndUser = {
    ...parsedPayload,
    user_id: userId,
    target_audience: parseArrayStringToArray(target_audience),
    course_chapter: parseArrayStringToArray(course_chapter)
  };

  try {
    const course = await courseRepository.createCourse(
      parsedPayloadWithCategoryAndUser
    );

    return course;
  } catch (err) {
    throw generateApplicationError(err, 'Error while creating course', 500);
  }
}

/**
 * @param {any} payload
 * @param {string} id
 */
export async function updateCourse(id, payload) {
  const { course_chapter, target_audience } = payload;

  const parsedPayload = omitPropertiesFromObject(payload, [
    'id',
    'created_at',
    'updated_at'
  ]);

  try {
    const parsedCourseChapters = /** @type {any[]} */ (
      parseArrayStringToArray(course_chapter)
    );

    const parsedTargetAudience = /** @type {any[]} */ (
      parseArrayStringToArray(target_audience)
    );

    const parsedPayloadArrayString = {
      ...parsedPayload,
      course_chapter: parsedCourseChapters,
      target_audience: parsedTargetAudience
    };

    const course = await courseRepository.getCourseById(id);

    // If course is not found
    if (!course) {
      throw new ApplicationError('Course not found', 404);
    }

    // Retrieve the list of chapters from the database
    const existingChapters =
      await courseChapterRepository.getChaptersByCourseId(id);

    // Delete any chapters that are in the database but not in the payload
    const chapterIdsInPayload = /** @type {string[]} */ (
      parsedCourseChapters?.map(({ id }) => id)
    );

    // Get the list of chapter ids that are in the database but not in the payload
    const chapterIdsToDelete = existingChapters
      .filter(({ dataValues: { id } }) => !chapterIdsInPayload.includes(id))
      .map(({ dataValues: { id } }) => id);

    await courseChapterRepository.destroyChapter(chapterIdsToDelete);

    await course.update(parsedPayloadArrayString);

    for (const chapter of parsedCourseChapters) {
      /** @type {{ id: string; course_material: any[] }} */
      const { id: chapterId, course_material } = chapter;

      // Retrieve the list of chapters from the database
      const existingMaterials = chapterId
        ? await courseMaterialRepository.getMaterialsByChapterId(chapterId)
        : [];

      // Delete any materials that are in the database but not in the payload
      const materialIdsInPayload = /** @type {string[]} */ (
        course_material.map(({ id }) => id)
      );

      // Get the list of material ids that are in the database but not in the payload
      const materialIdsToDelete = existingMaterials
        .filter(({ dataValues: { id } }) => !materialIdsInPayload.includes(id))
        .map(({ dataValues: { id } }) => id);

      await courseMaterialRepository.destroyMaterial(materialIdsToDelete);

      const courseChapter = chapterId
        ? await courseChapterRepository.getChapterById(chapterId)
        : null;

      if (courseChapter) {
        await courseChapterRepository.updateChapter(chapter, chapterId);

        for (const material of course_material) {
          const { id: materialId } = material;

          if (materialId) {
            const courseMaterial =
              await courseMaterialRepository.getMaterialById(materialId);

            if (courseMaterial) {
              await courseMaterialRepository.updateMaterial(
                material,
                materialId
              );
            }
          } else {
            const parsedMaterialWithChapterId = {
              ...material,
              course_chapter_id: chapterId
            };

            const newMaterial = await courseMaterialRepository.createMaterial(
              parsedMaterialWithChapterId
            );

            await courseMaterialStatusRepository.backfillCourseMaterialStatus(
              id,
              newMaterial.dataValues.id
            );
          }
        }
      } else {
        const newChapter = await courseChapterRepository.createChapter(chapter);

        for (const material of course_material) {
          const newMaterial = await courseMaterialRepository.createMaterial({
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
