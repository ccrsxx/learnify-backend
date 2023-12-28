import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../validation.js'), jest.Mock>} ValidationMiddlewareMock */
/** @typedef {Record<keyof import('../../services/user.js'), jest.Mock>} UserServiceMock */
/** @typedef {Record<keyof import('../../services/course.js'), jest.Mock>} CourseServiceMock */
/**
 * @typedef {Record<
 *   keyof import('../../services/user-payment.js'),
 *   jest.Mock
 * >} UserPaymentServiceMock
 */
/**
 * @typedef {Record<
 *   keyof import('../../services/user-notification.js'),
 *   jest.Mock
 * >} UserNotificationServiceMock
 */
/**
 * @typedef {Record<
 *   keyof import('../../services/course-material-status.js'),
 *   jest.Mock
 * >} CourseMaterialStatusServiceMock
 */

jest.unstable_mockModule(
  '../../services/course.js',
  () =>
    /** @type {CourseServiceMock} */
    ({
      getCourseById: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../services/user.js',
  () =>
    /** @type {UserServiceMock} */
    ({
      getUnverifiedUserByEmail: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../services/user-payment.js',
  () =>
    /** @type {UserPaymentServiceMock} */
    ({
      getUserPaymentById: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../services/course-material-status.js',
  () =>
    /** @type {CourseMaterialStatusServiceMock} */
    ({
      getCourseMaterialStatusById: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../services/user-notification.js',
  () =>
    /** @type {UserNotificationServiceMock} */
    ({
      getUserNotificationById: jest.fn()
    })
);

const validationMiddleware = /** @type {ValidationMiddlewareMock} */ (
  await import('../validation.js')
);

const courseService = /** @type {CourseServiceMock} */ (
  await import('../../services/course.js')
);

const courseMaterialStatusService =
  /** @type {CourseMaterialStatusServiceMock} */ (
    await import('../../services/course-material-status.js')
  );

const userService = /** @type {UserServiceMock} */ (
  await import('../../services/user.js')
);

const userNotificationService = /** @type {UserNotificationServiceMock} */ (
  await import('../../services/user-notification.js')
);

const paymentService = /** @type {UserPaymentServiceMock} */ (
  await import('../../services/user-payment.js')
);

describe('Validation middleware', () => {
  describe('Is valid credential', () => {
    it('passes the middleware with email', async () => {
      const mockRequest = {
        body: {
          email: 'emilia@rezero.com',
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
          phone_number: '0812',
          password: 'secret'
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

  describe('Is valid email', () => {
    it('passes the middleware if email is provided and is a string', async () => {
      const mockRequest = {
        body: {
          email: 'emilia@rezero.com'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when email is not provided', async () => {
      const mockRequest = {
        body: {}
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 400 when email is not string', async () => {
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

      validationMiddleware.isValidEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email must be string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Is valid reset password payload', () => {
    it('passes the middleware if token and password are provided and are strings', async () => {
      const mockRequest = {
        body: {
          token: 'Valid Token',
          password: 'secret'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidResetPasswordPayload(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when token and password are not provided', async () => {
      const mockRequest = {
        body: {}
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidResetPasswordPayload(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token and password are required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 400 when token and password are not string', async () => {
      const mockRequest = {
        body: {
          token: 1,
          password: 1
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidResetPasswordPayload(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token and password must be string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Is valid verify otp payload', () => {
    it('passes the middleware if otp and email are provided and are strings', async () => {
      const mockRequest = {
        body: {
          otp: '12345',
          email: 'emilia@rezero.com'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidVerifyOtpPayload(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when otp and email are not provided', async () => {
      const mockRequest = {
        body: {}
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidVerifyOtpPayload(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'OTP and email are required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 400 when otp and email are not string', async () => {
      const mockRequest = {
        body: {
          otp: 1,
          email: 1
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidVerifyOtpPayload(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'OTP and email must be string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Is valid reset password profile', () => {
    it('passes the middleware if password is valid', async () => {
      const mockRequest = {
        body: {
          old_password: 'password',
          new_password: 'newPassword'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidResetPasswordProfile(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when old password and new password are not provided', async () => {
      const mockRequest = {
        body: {}
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidResetPasswordProfile(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Old password and new password are required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 400 when old password and new password are not string', async () => {
      const mockRequest = {
        body: {
          old_password: 1,
          new_password: 1
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidResetPasswordProfile(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Old password and new password must be string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 409 when old password and new password are same', async () => {
      const mockRequest = {
        body: {
          old_password: 'secret',
          new_password: 'secret'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      validationMiddleware.isValidResetPasswordProfile(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'New password cannot be the same as old password'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Is unverified user exists', () => {
    it('passes the middleware and put user data to locals', async () => {
      const mockUser = {
        id: '1',
        name: 'Emilia'
      };

      userService.getUnverifiedUserByEmail.mockResolvedValue(
        /** @ts-ignore */
        { dataValues: mockUser }
      );

      const mockRequest = {
        body: {
          email: 'emilia@rezero.com'
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await validationMiddleware.isUnverifiedUserExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({ user: mockUser });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 404 when user is not found', async () => {
      const mockError = new ApplicationError('User not found', 404);

      userService.getUnverifiedUserByEmail.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        body: {
          email: 'rem@rezero.com'
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await validationMiddleware.isUnverifiedUserExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws generic error when user service fails', async () => {
      const mockError = new Error('Internal server error');

      userService.getUnverifiedUserByEmail.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        body: {
          email: 'rem@rezero.com'
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await validationMiddleware.isUnverifiedUserExists(
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

  describe('Is payment exists', () => {
    it('passes the middleware and put payment data to locals', async () => {
      const mockPayment = {
        id: '1',
        status: 'PENDING',
        payment_method: 'CREDIT_CARD'
      };

      paymentService.getUserPaymentById.mockResolvedValue(
        /** @ts-ignore */
        { dataValues: mockPayment }
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

      await validationMiddleware.isPaymentExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({ payment: mockPayment });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 404 when payment is not found', async () => {
      const mockError = new ApplicationError('Payment not found', 404);

      paymentService.getUserPaymentById.mockRejectedValue(
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

      await validationMiddleware.isPaymentExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Payment not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws generic error when payment service fails', async () => {
      const mockError = new Error('Internal server error');

      paymentService.getUserPaymentById.mockRejectedValue(
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

      await validationMiddleware.isPaymentExists(
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

  describe('Is course material status exists', () => {
    it('passes the middleware and put course material status data to locals', async () => {
      const mockCourseMaterialStatus = {
        id: '1',
        completed: false
      };

      courseMaterialStatusService.getCourseMaterialStatusById.mockResolvedValue(
        /** @ts-ignore */
        { dataValues: mockCourseMaterialStatus }
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

      await validationMiddleware.isCourseMaterialStatusExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({
        courseMaterialStatus: mockCourseMaterialStatus
      });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 404 when course material status is not found', async () => {
      const mockError = new ApplicationError(
        'Course material status not found',
        404
      );

      courseMaterialStatusService.getCourseMaterialStatusById.mockRejectedValue(
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

      await validationMiddleware.isCourseMaterialStatusExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Course material status not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws generic error when course material status service fails', async () => {
      const mockError = new Error('Internal server error');

      courseMaterialStatusService.getCourseMaterialStatusById.mockRejectedValue(
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

      await validationMiddleware.isCourseMaterialStatusExists(
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

  describe('Is user notification exists', () => {
    it('passes the middleware and put user notification data to locals', async () => {
      const mockUserNotification = {
        id: '1',
        name: 'Emilia',
        viewed: false
      };

      userNotificationService.getUserNotificationById.mockResolvedValue(
        /** @ts-ignore */
        { dataValues: mockUserNotification }
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

      await validationMiddleware.isUserNotificationExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({
        userNotification: mockUserNotification
      });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 404 when user notification is not found', async () => {
      const mockError = new ApplicationError(
        'User notification not found',
        404
      );

      userNotificationService.getUserNotificationById.mockRejectedValue(
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

      await validationMiddleware.isUserNotificationExists(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User notification not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws generic error when user notification service fails', async () => {
      const mockError = new Error('Internal server error');

      userNotificationService.getUserNotificationById.mockRejectedValue(
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

      await validationMiddleware.isUserNotificationExists(
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
