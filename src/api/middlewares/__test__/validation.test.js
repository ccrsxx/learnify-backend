import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../validation.js'), jest.Mock>} ValidationMiddlewareMock */
/** @typedef {Record<keyof import('../../services/course.js'), jest.Mock>} CourseServiceMock */

jest.unstable_mockModule(
  '../../services/course.js',
  () =>
    /** @type {CourseServiceMock} */
    ({
      getCourseById: jest.fn()
    })
);

const validationMiddleware = /** @type {ValidationMiddlewareMock} */ (
  await import('../validation.js')
);

const courseService = /** @type {CourseServiceMock} */ (
  await import('../../services/course.js')
);

describe('Validation middleware', () => {
  describe('Is valid credential', () => {
    it('passes the middleware with email', async () => {
      const mockRequest = {
        body: {
          email: 'Emilia',
          password: 'Best girl'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidCredential(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('passes the middleware with phone number', async () => {
      const mockRequest = {
        body: {
          phone_number: 'Emilia',
          password: 'Best girl'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidCredential(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when email or phone number and password are not provided', async () => {
      const mockRequest = {
        body: {}
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidCredential(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email or phone number and password are required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 400 when email or phone number and password are not string', async () => {
      const mockRequest = {
        body: {
          email: 1,
          password: 1
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidCredential(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email or phone number and password must be string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Is course exists', () => {
    it('passes the middleware and put course data to locals', async () => {
      const mockCourse = {
        id: '1',
        name: 'Emilia'
      };

      courseService.getCourseById.mockResolvedValue(
        /** @ts-ignore */
        { dataValues: mockCourse }
      );

      const mockRequest = {
        params: {
          id: '1'
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await validationMiddleware.isCourseExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({ course: mockCourse });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 404 when course is not found', async () => {
      const mockError = new ApplicationError('Course not found', 404);

      courseService.getCourseById.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        params: {
          id: '1'
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await validationMiddleware.isCourseExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Course not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws generic error when course service fails', async () => {
      const mockError = new Error('Internal server error');

      courseService.getCourseById.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        params: {
          id: '1'
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await validationMiddleware.isCourseExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
