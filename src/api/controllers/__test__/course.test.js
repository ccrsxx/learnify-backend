import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../course.js'), jest.Mock>} CourseControllerMock */
/** @typedef {Record<keyof import('../../services/course.js'), jest.Mock>} CourseServiceMock */

jest.unstable_mockModule(
  '../../services/course.js',
  () =>
    /** @type {CourseServiceMock} */
    ({
      getCourses: jest.fn(),
      getUserCourses: jest.fn(),
      getCourseById: jest.fn(),
      createCourse: jest.fn(),
      updateCourse: jest.fn(),
      destroyCourse: jest.fn()
    })
);

const courseController = /** @type {CourseControllerMock} */ (
  await import('../course.js')
);

const courseService = /** @type {CourseServiceMock} */ (
  await import('../../services/course.js')
);

describe('Course controller', () => {
  describe('Get courses', () => {
    it('returns list of courses', async () => {
      const mockCourses = [
        {
          id: '1',
          name: 'Emilia'
        },
        {
          id: '2',
          name: 'Rem'
        },
        {
          id: '3',
          name: 'Ram'
        }
      ];

      courseService.getCourses.mockResolvedValue(
        // @ts-ignore
        mockCourses
      );

      const mockRequest = {};

      const mockResponse = {
        locals: { user: null },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      await courseController.getCourses(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockCourses });
    });

    it('throws application error when getCourses fails', async () => {
      const mockError = new ApplicationError('Failed to get course', 500);

      courseService.getCourses.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {};

      const mockResponse = {
        locals: { user: null },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      await courseController.getCourses(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when getCourses fails', async () => {
      const mockError = new Error();

      courseService.getCourses.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {};

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      await courseController.getCourses(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('getUserCourses', () => {
    it('returns user courses when successful', async () => {
      const mockCourses = [
        {
          id: '1',
          name: 'Emilia'
        },
        {
          id: '2',
          name: 'Rem'
        }
      ];

      // @ts-ignore
      courseService.getUserCourses.mockResolvedValue(mockCourses);

      const mockRequest = {
        query: {}
      };

      const mockResponse = {
        locals: { user: { id: '1' } },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.getUserCourses(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockCourses });
    });

    it('returns application error when getUserCourses fails', async () => {
      const mockError = new ApplicationError('Failed to get user courses', 500);

      // @ts-ignore
      courseService.getUserCourses.mockRejectedValue(mockError);

      const mockRequest = {
        query: {}
      };

      const mockResponse = {
        locals: { user: { id: '1' } },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.getUserCourses(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('returns generic error when getUserCourses fails', async () => {
      const mockError = new Error();

      // @ts-ignore
      courseService.getUserCourses.mockRejectedValue(mockError);

      const mockRequest = {
        query: {}
      };

      const mockResponse = {
        locals: { user: { id: '1' } },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.getUserCourses(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('getCourseById', () => {
    it('returns course data when successful', async () => {
      const mockCourse = {
        id: '1',
        name: 'Emilia'
      };

      // @ts-ignore
      courseService.getCourseById.mockResolvedValue(mockCourse);

      const mockRequest = {
        params: { id: '1' }
      };

      const mockResponse = {
        locals: { user: null },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.getCourseById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockCourse });
    });

    it('returns application error when getCourseById fails', async () => {
      const mockError = new ApplicationError('Failed to get course', 500);

      // @ts-ignore
      courseService.getCourseById.mockRejectedValue(mockError);

      const mockRequest = {
        params: { id: '1' }
      };

      const mockResponse = {
        locals: { user: null },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.getCourseById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('returns generic error when getCourseById fails', async () => {
      const mockError = new Error();

      // @ts-ignore
      courseService.getCourseById.mockRejectedValue(mockError);

      const mockRequest = {
        params: { id: '1' }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.getCourseById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Create course', () => {
    it('creates a course', async () => {
      const mockCourse = {
        id: '1',
        name: 'course1'
      };

      const image = 'default image update later';

      const mockCourseWithImage = { ...mockCourse, image: image };

      courseService.createCourse.mockResolvedValue(
        // @ts-ignore
        mockCourse
      );

      const mockRequest = {
        body: mockCourseWithImage
      };

      const mockResponse = {
        locals: { user: {} },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      await courseController.createCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Course created successfully',
        data: mockCourse
      });
    });

    it('throws application error when createCourse fails', async () => {
      const mockError = new ApplicationError('Failed to create course', 500);

      courseService.createCourse.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {};

      const mockResponse = {
        locals: { user: {} },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.createCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when createCourse fails', async () => {
      const mockError = new Error();

      courseService.createCourse.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {};

      const mockResponse = {
        locals: { user: {} },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.createCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('updateCourse', () => {
    it('updates course and returns success message when successful', async () => {
      const mockCourse = {
        id: '1',
        name: 'Emilia',
        image: 'image.jpg'
      };

      // @ts-ignore
      courseService.updateCourse.mockResolvedValue(mockCourse);

      const mockRequest = {
        params: { id: '1' },
        body: { name: 'Emilia' }
      };

      const mockResponse = {
        locals: { image: 'image.jpg' },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.updateCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Course updated successfully',
        data: mockCourse
      });
    });

    it('returns application error when updateCourse fails', async () => {
      const mockError = new ApplicationError('Failed to update course', 500);

      // @ts-ignore
      courseService.updateCourse.mockRejectedValue(mockError);

      const mockRequest = {
        params: { id: '1' },
        body: { name: 'Emilia' }
      };

      const mockResponse = {
        locals: { image: 'image.jpg' },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.updateCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('returns generic error when updateCourse fails', async () => {
      const mockError = new Error();

      // @ts-ignore
      courseService.updateCourse.mockRejectedValue(mockError);

      const mockRequest = {
        params: { id: '1' },
        body: { name: 'Emilia' }
      };

      const mockResponse = {
        locals: { image: 'image.jpg' },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.updateCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Destroy course', () => {
    it('destroys a course', async () => {
      const mockCourse = {
        id: '1',
        name: 'Toyota'
      };

      courseService.destroyCourse.mockResolvedValue(
        // @ts-ignore
        mockCourse
      );

      const mockRequest = {
        params: { id: mockCourse.id }
      };

      const mockResponse = {
        locals: { user: {} },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      await courseController.destroyCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Course deleted successfully'
      });
    });

    it('throws application error when destroyCourse fails', async () => {
      const mockError = new ApplicationError('Failed to destroy course', 500);

      courseService.destroyCourse.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        params: {
          id: 1
        }
      };

      const mockResponse = {
        locals: { user: {} },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.destroyCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when destroyCourse fails', async () => {
      const mockError = new Error();

      courseService.destroyCourse.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        params: {
          id: 1
        }
      };

      const mockResponse = {
        locals: { user: {} },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await courseController.destroyCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
