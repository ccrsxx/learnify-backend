import { Course, CourseChapter, CourseMaterial } from '../models/index.js';

export function getCourses() {
  return Course.findAll({
    include: ['user', 'course_category']
  });
}

/** @param {string} id */
export function getCourseById(id) {
  return Course.findByPk(id, {
    include: [
      'user',
      'course_category',
      {
        model: CourseChapter,
        as: 'chapters'
      }
    ]
  });
}

/** @param {string} id */
export function getCourseDataById(id) {
  return Course.findByPk(id, {
    include: [
      {
        model: CourseChapter,
        as: 'chapters',
        include: [
          {
            model: CourseMaterial,
            as: 'course_material'
          }
        ]
      }
    ],
    attributes: {
      exclude: [
        'code',
        'price',
        'image',
        'author',
        'rating',
        'premium',
        'telegram',
        'difficulty',
        'description',
        'intro_video',
        'onboarding_text',
        'target_audience',
        'user_id',
        'course_category_id',
        'createdAt',
        'updatedAt'
      ]
    }
  });
}
