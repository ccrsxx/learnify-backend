import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../auth.js'), jest.Mock>} AuthControllerMock */
/** @typedef {Record<keyof import('../../services/auth.js'), jest.Mock>} AuthServiceMock */
/** @typedef {Record<keyof import('../../services/user.js'), jest.Mock>} UserServiceMock */

jest.unstable_mockModule(
  '../../services/auth.js',
  () =>
    /** @type {AuthServiceMock} */
    ({
      isPasswordMatch: jest.fn(),
      generateToken: jest.fn(),
      sendVerifyToResetPassword: jest.fn(),
      sendOtpRequest: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../services/user.js',
  () =>
    /** @type {UserServiceMock} */
    ({
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      getUserByPhoneNumber: jest.fn(),
      getAdminUserByEmail: jest.fn(),
      getAdminUserByPhoneNumber: jest.fn()
    })
);

const authController = /** @type {AuthControllerMock} */ (
  await import('../auth.js')
);

const authService = /** @type {AuthServiceMock} */ (
  await import('../../services/auth.js')
);

const userService = /** @type {UserServiceMock} */ (
  await import('../../services/user.js')
);

describe('Auth controller', () => {
  describe('Register', () => {
    it('returns 201 status code with message and user data', async () => {
      const mockUser = {
        name: 'Emilia'
      };

      userService.createUser.mockResolvedValue(
        // @ts-ignore
        mockUser
      );

      const mockRequest = {
        body: mockUser
      };

      const mockResponse = {
        locals: { isSuperAdmin: true },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        data: mockUser
      });
    });

    it('throws application error when user service throws fails', async () => {
      const mockError = new ApplicationError('User not found', 404);

      const mockUser = {
        name: 'Emilia'
      };

      const mockRequest = {
        body: mockUser
      };

      const mockResponse = {
        locals: { isSuperAdmin: true },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.createUser.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when user service throws fails', async () => {
      const mockError = new Error();

      const mockUser = {
        name: 'Emilia'
      };

      const mockRequest = {
        body: mockUser
      };

      const mockResponse = {
        locals: {},
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.createUser.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Login', () => {
    it('returns 200 status code with message and user data when login using email', async () => {
      const mockToken = 'Emilia is the best girl';

      const mockUser = {
        name: 'Emilia',
        password: '123'
      };

      const mockRequest = {
        body: {
          email: mockUser.name,
          password: mockUser.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.getUserByEmail.mockResolvedValue(
        // @ts-ignore
        { dataValues: mockUser }
      );

      authService.isPasswordMatch.mockResolvedValue(
        // @ts-ignore
        true
      );

      authService.generateToken.mockResolvedValue(
        // @ts-ignore
        mockToken
      );

      await authController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successfully',
        data: {
          ...mockUser,
          token: mockToken
        }
      });
    });

    it('returns 200 status code with message and user data when login using phone number', async () => {
      const mockToken = 'Emilia is the best girl';

      const mockUser = {
        name: 'Emilia',
        password: '123'
      };

      const mockRequest = {
        body: {
          phone_number: mockUser.name,
          password: mockUser.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.getUserByPhoneNumber.mockResolvedValue(
        // @ts-ignore
        { dataValues: mockUser }
      );

      authService.isPasswordMatch.mockResolvedValue(
        // @ts-ignore
        true
      );

      authService.generateToken.mockResolvedValue(
        // @ts-ignore
        mockToken
      );

      await authController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successfully',
        data: {
          ...mockUser,
          token: mockToken
        }
      });
    });

    it('returns 401 status code when password is not match', async () => {
      const mockUser = {
        dataValues: {
          name: 'Emilia',
          password: '123'
        }
      };

      const mockRequest = {
        body: {
          email: mockUser.dataValues.name,
          password: mockUser.dataValues.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      authService.isPasswordMatch.mockResolvedValue(
        // @ts-ignore
        false
      );

      await authController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password is not match'
      });
    });

    it('throws application error when user service fails', async () => {
      const mockError = new ApplicationError('User not found', 404);

      const mockUser = {
        dataValues: {
          name: 'Emilia',
          password: '123'
        }
      };

      const mockRequest = {
        body: {
          email: mockUser.dataValues.name,
          password: mockUser.dataValues.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.getUserByEmail.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await authController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when user service fails', async () => {
      const mockError = new Error();

      const mockUser = {
        dataValues: {
          name: 'Emilia',
          password: '123'
        }
      };

      const mockRequest = {
        body: {
          email: mockUser.dataValues.name,
          password: mockUser.dataValues.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.getUserByEmail.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await authController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Login as admin', () => {
    it('returns 200 status code with message and user data when login using email', async () => {
      const mockToken = 'Emilia is the best girl';

      const mockUser = {
        name: 'Emilia',
        password: '123'
      };

      const mockRequest = {
        body: {
          email: mockUser.name,
          password: mockUser.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.getAdminUserByEmail.mockResolvedValue(
        // @ts-ignore
        { dataValues: mockUser }
      );

      authService.isPasswordMatch.mockResolvedValue(
        // @ts-ignore
        true
      );

      authService.generateToken.mockResolvedValue(
        // @ts-ignore
        mockToken
      );

      await authController.loginWithAdmin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successfully',
        data: {
          ...mockUser,
          token: mockToken
        }
      });
    });

    it('returns 200 status code with message and user data when login using phone number', async () => {
      const mockToken = 'Emilia is the best girl';

      const mockUser = {
        name: 'Emilia',
        password: '123'
      };

      const mockRequest = {
        body: {
          phone_number: mockUser.name,
          password: mockUser.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.getAdminUserByPhoneNumber.mockResolvedValue(
        // @ts-ignore
        { dataValues: mockUser }
      );

      authService.isPasswordMatch.mockResolvedValue(
        // @ts-ignore
        true
      );

      authService.generateToken.mockResolvedValue(
        // @ts-ignore
        mockToken
      );

      await authController.loginWithAdmin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successfully',
        data: {
          ...mockUser,
          token: mockToken
        }
      });
    });

    it('returns 401 status code when password is not match', async () => {
      const mockUser = {
        dataValues: {
          name: 'Emilia',
          password: '123'
        }
      };

      const mockRequest = {
        body: {
          email: mockUser.dataValues.name,
          password: mockUser.dataValues.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      authService.isPasswordMatch.mockResolvedValue(
        // @ts-ignore
        false
      );

      await authController.loginWithAdmin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password is not match'
      });
    });

    it('throws application error when user service fails', async () => {
      const mockError = new ApplicationError('User not found', 404);

      const mockUser = {
        dataValues: {
          name: 'Emilia',
          password: '123'
        }
      };

      const mockRequest = {
        body: {
          email: mockUser.dataValues.name,
          password: mockUser.dataValues.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.getAdminUserByEmail.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await authController.loginWithAdmin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when user service fails', async () => {
      const mockError = new Error();

      const mockUser = {
        dataValues: {
          name: 'Emilia',
          password: '123'
        }
      };

      const mockRequest = {
        body: {
          email: mockUser.dataValues.name,
          password: mockUser.dataValues.password
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      userService.getAdminUserByEmail.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await authController.loginWithAdmin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Send verification to Reset Password', () => {
    it('returns 201 status code with message', async () => {
      const mockRequest = {
        body: {
          email: 'Emilia'
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.sendVerifyToResetPassword.mockResolvedValue(undefined);
      await authController.sendVerifyToResetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Account verification sent successfully'
      });
    });

    it('throws application error when sendVerifyToResetPassword service throws fails', async () => {
      const mockError = new ApplicationError(
        'Error while creating reset password link',
        500
      );

      const mockRequest = {
        body: {
          email: 'Emilia'
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.sendVerifyToResetPassword.mockRejectedValue(mockError);
      await authController.sendVerifyToResetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when sendVerifyToResetPassword service throws fails', async () => {
      const mockError = new Error();

      const mockRequest = {
        body: {
          email: 'Emilia'
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.sendVerifyToResetPassword.mockRejectedValue(mockError);
      await authController.sendVerifyToResetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
