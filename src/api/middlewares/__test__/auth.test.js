import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../auth.js'), jest.Mock>} AuthMiddlewareMock */
/** @typedef {Record<keyof import('../../services/auth.js'), jest.Mock>} AuthServiceMock */

jest.unstable_mockModule(
  '../../services/auth.js',
  () =>
    /** @type {AuthServiceMock} */
    ({
      verifyToken: jest.fn()
    })
);

const authMiddleware = /** @type {AuthMiddlewareMock} */ (
  await import('../auth.js')
);

const authService = /** @type {AuthServiceMock} */ (
  await import('../../services/auth.js')
);

describe('Auth middleware', () => {
  describe('Is authorized', () => {
    it('passes the middleware and put the user to the res.locals', async () => {
      const mockUser = {
        name: 'Emilia'
      };

      authService.verifyToken.mockResolvedValue(
        // @ts-ignore
        { dataValues: mockUser }
      );

      const mockToken = 'Bearer Emilia-tan';

      const mockRequest = {
        get: jest.fn().mockReturnValue(mockToken)
      };

      const mockResponse = {
        locals: {}
      };

      const mockNext = jest.fn();

      await authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.locals).toEqual({ user: mockUser });

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 400 status code with message when authorization header is missing', async () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue(undefined)
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Missing authorization header'
      });

      expect(mockResponse.locals).toEqual({});
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 401 status code with message when authorization type is not bearer', async () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue('Basic Emilia-tan')
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid authorization token'
      });

      expect(mockResponse.locals).toEqual({});
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws application error when verify token fails', async () => {
      const mockError = new ApplicationError('Token expired', 401);

      authService.verifyToken.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer Emilia-tan')
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });

      expect(mockResponse.locals).toEqual({});
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws generic error when verify token fails', async () => {
      const mockError = new Error();

      authService.verifyToken.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer Emilia-tan')
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await authMiddleware.isAuthorized(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });

      expect(mockResponse.locals).toEqual({});
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Is admin', () => {
    it('passes the middleware when user is superadmin and put the isAdmin to the res.locals', () => {
      const mockRequest = {};

      const mockResponse = {
        locals: { user: { admin: true } }
      };

      const mockNext = jest.fn();

      authMiddleware.isAdmin(mockRequest, mockResponse, mockNext);

      expect(mockResponse.locals).toEqual({
        user: { admin: true },
        isAdmin: true
      });

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('passes the middleware when user is admin and put the isAdmin to the res.locals', () => {
      const mockRequest = {};

      const mockResponse = {
        locals: { user: { admin: true } }
      };

      const mockNext = jest.fn();

      authMiddleware.isAdmin(mockRequest, mockResponse, mockNext);

      expect(mockResponse.locals).toEqual({
        user: { admin: true },
        isAdmin: true
      });

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('returns 403 status code with message when user is not admin', () => {
      const mockRequest = {};

      const mockResponse = {
        locals: { user: { admin: false } },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      authMiddleware.isAdmin(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Only admin is allowed for this endpoint'
      });

      expect(mockResponse.locals).toEqual({ user: { admin: false } });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Is logged in', () => {
    it('returns 400 status code with message when authorization header is missing', async () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue(undefined)
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await authMiddleware.isLoggedIn(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.locals).toEqual({ user: null });
      expect(mockNext).toHaveBeenCalled();
    });

    it('returns 401 status code with message when authorization type is not bearer', async () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue('Basic Emilia-tan')
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await authMiddleware.isLoggedIn(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid authorization token'
      });

      expect(mockResponse.locals).toEqual({});
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('passes the middleware and put the user to the res.locals', async () => {
      const mockUser = {
        name: 'Emilia'
      };

      authService.verifyToken.mockResolvedValue(
        // @ts-ignore
        { dataValues: mockUser }
      );

      const mockToken = 'Bearer Emilia-tan';

      const mockRequest = {
        get: jest.fn().mockReturnValue(mockToken)
      };

      const mockResponse = {
        locals: {}
      };

      const mockNext = jest.fn();

      await authMiddleware.isLoggedIn(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.locals).toEqual({ user: mockUser });

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('throws application error when verify token fails', async () => {
      const mockError = new ApplicationError('Token expired', 401);

      authService.verifyToken.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer Emilia-tan')
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await authMiddleware.isLoggedIn(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });

      expect(mockResponse.locals).toEqual({});
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws generic error when verify token fails', async () => {
      const mockError = new Error();

      authService.verifyToken.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer Emilia-tan')
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await authMiddleware.isLoggedIn(mockRequest, mockResponse, mockNext);

      expect(mockRequest.get).toHaveBeenCalledWith('authorization');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });

      expect(mockResponse.locals).toEqual({});
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
