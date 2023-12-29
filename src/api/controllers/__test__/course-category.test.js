import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../course-category.js'), jest.Mock>} CourseCategoryControllerMock */
/**
 * @typedef {Record<
 *   keyof import('../../services/course-category.js'),
 *   jest.Mock
 * >} CourseCategoryServiceMock
 */

jest.unstable_mockModule(
  '../../services/course-category.js',
  () =>
    /** @type {CourseCategoryServiceMock} */
    ({
      getCourseCategories: jest.fn()
    })
);

const courseCategoryController = /** @type {CourseCategoryControllerMock} */ (
  await import('../course-category.js')
);

const courseCategoryService = /** @type {CourseCategoryServiceMock} */ (
  await import('../../services/course-category.js')
);

describe('Course category controller', () => {
  describe('Get course categories', () => {
    it('returns list of course categories', async () => {
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

      courseCategoryService.getCourseCategories.mockResolvedValue(
        // @ts-ignore
        mockCourseCategories
      );

      const mockRequest = {};

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await courseCategoryController.getCourseCategories(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockCourseCategories
      });
    });

    it('throws application error when getCourseCategories fails', async () => {
      const mockError = new ApplicationError(
        'Failed to get course categories',
        500
      );

      courseCategoryService.getCourseCategories.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {};

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await courseCategoryController.getCourseCategories(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when getCourseCategories fails', async () => {
      const mockError = new Error();

      courseCategoryService.getCourseCategories.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {};

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await courseCategoryController.getCourseCategories(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
