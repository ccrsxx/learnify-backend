import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/**
 * @typedef {Record<
 *   keyof import('../../repositories/course-category.js'),
 *   jest.Mock
 * >} CourseCategoryRepositoryMock
 */
/** @typedef {Record<keyof import('../course-category.js'), jest.Mock>} CourseCategoryServiceMock */

jest.unstable_mockModule(
  '../../repositories/course-category.js',
  () =>
    /** @type {CourseCategoryRepositoryMock} */
    ({
      getCourseCategories: jest.fn()
    })
);

const courseCategoryRepository = /** @type {CourseCategoryRepositoryMock} */ (
  await import('../../repositories/course-category.js')
);

const courseCategoryService = /** @type {CourseCategoryServiceMock} */ (
  await import('../course-category.js')
);

describe('Course category service', () => {
  describe('Get Course categories', () => {
    it('returns course category data', async () => {
      const mockCourseCategories = [
        {
          id: '1',
          name: 'Web',
          image: 'www.img.com'
        },
        {
          id: '2',
          name: 'Mobile',
          image: 'www.img.com'
        }
      ];

      courseCategoryRepository.getCourseCategories.mockResolvedValue(
        /** @ts-ignore */
        mockCourseCategories
      );

      const courseCategories = await courseCategoryService.getCourseCategories(
        {}
      );

      expect(courseCategories).toEqual(mockCourseCategories);
    });

    it('throws application error when getting course categories fails', async () => {
      const mockError = new ApplicationError(
        'Failed to get course categories',
        500
      );

      courseCategoryRepository.getCourseCategories.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(
        courseCategoryService.getCourseCategories({})
      ).rejects.toThrow(
        `Error while getting course categories: ${mockError.message}`
      );
    });
  });
});
