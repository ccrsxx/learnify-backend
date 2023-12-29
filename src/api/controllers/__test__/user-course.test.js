import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../user-course.js'), jest.Mock>} UserCourseControllerMock */
/** @typedef {Record<keyof import('../../services/user-course.js'), jest.Mock>} UserCourseServiceMock */

jest.unstable_mockModule(
  '../../services/user-course.js',
  () =>
    /** @type {UserCourseServiceMock} */
    ({
      setOnboardedTrue: jest.fn()
    })
);

const userCourseController = /** @type {UserCourseControllerMock} */ (
  await import('../user-course.js')
);

const userCourseService = /** @type {UserCourseServiceMock} */ (
  await import('../../services/user-course.js')
);

describe('User course controller', () => {
  describe('Set onboarderd to true', () => {
    it('update onboarded status on user course', async () => {
      const mockUserCourses = {
        id: '123',
        user_id: '123',
        onboarded: true
      };

      userCourseService.setOnboardedTrue.mockResolvedValue(
        // @ts-ignore
        mockUserCourses
      );

      const mockRequest = {
        params: {
          id: '1'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await userCourseController.setOnboardedTrue(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Onboarded updated successfully',
        data: mockUserCourses
      });
    });

    it('throws application error when setOnboardedTrue fails', async () => {
      const mockError = new ApplicationError(
        'Failed to update user courses',
        500
      );

      userCourseService.setOnboardedTrue.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        params: {
          id: '1'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await userCourseController.setOnboardedTrue(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when setOnboardedTrue fails', async () => {
      const mockError = new Error();

      userCourseService.setOnboardedTrue.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        params: {
          id: '1'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await userCourseController.setOnboardedTrue(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
