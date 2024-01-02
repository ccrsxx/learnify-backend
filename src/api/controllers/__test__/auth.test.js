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
      sendOtpRequest: jest.fn(),
      checkLinkToResetPassword: jest.fn(),
      changePassword: jest.fn(),
      verifyOtp: jest.fn()
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

  describe('Check link to reset password', () => {
    it('returns 200 status code with message validation', async () => {
      const data = {
        used: false,
        token: 'thisisatoken'
      };
      const mockRequest = {
        params: {
          token: data.token
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      authService.checkLinkToResetPassword.mockResolvedValue(data);
      await authController.checkLinkToResetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Verification is valid'
      });
    });

    it('throws application error when check verification service throws fails', async () => {
      const mockError = new ApplicationError(
        'Error while checking reset password link',
        500
      );

      const mockRequest = {
        params: {
          token: 'thisisatoken'
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.checkLinkToResetPassword.mockRejectedValue(mockError);
      await authController.checkLinkToResetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when check verification service throws fails', async () => {
      const mockError = new Error();

      const mockRequest = {
        params: {
          token: 'thisisatoken'
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.checkLinkToResetPassword.mockRejectedValue(mockError);
      await authController.checkLinkToResetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Change password', () => {
    it('return 200 status code with successful message', async () => {
      const mockRequest = {
        token: 'thisistoken',
        password: 'newPassword'
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.changePassword.mockResolvedValue(undefined);
      await authController.changePassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password successfully updated'
      });
    });

    it('throws application error when change password service throws fails', async () => {
      const mockError = new ApplicationError(
        'Error while checking reset password link',
        500
      );

      const mockRequest = {
        params: {
          token: 'thisisatoken',
          password: 'newPassword'
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.changePassword.mockRejectedValue(mockError);
      await authController.changePassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when change password service throws fails', async () => {
      const mockError = new Error();

      const mockRequest = {
        params: {
          token: 'thisisatoken',
          password: 'newPassword'
        }
      };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.changePassword.mockRejectedValue(mockError);
      await authController.changePassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Send otp verification', () => {
    it('returns 201 status code with successful message', async () => {
      const mockRequest = {
        body: {
          email: 'Emilia email'
        }
      };

      const mockResponse = {
        locals: {
          user: {
            userId: 'thisisId'
          }
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      authService.sendOtpRequest.mockResolvedValue(undefined);
      await authController.sendOtpRequest(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'OTP sent successfully'
      });
    });

    it('throws application error when sending verification service throws fails', async () => {
      const mockError = new ApplicationError(
        'Error while checking reset password link',
        500
      );

      const mockRequest = {
        body: {
          email: 'Emilia email'
        }
      };

      const mockResponse = {
        locals: {
          user: {
            userId: 'thisisId'
          }
        },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.sendOtpRequest.mockRejectedValue(mockError);
      await authController.sendOtpRequest(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when sending verification service throws fails', async () => {
      const mockError = new Error();

      const mockRequest = {
        body: {
          email: 'Emilia email'
        }
      };

      const mockResponse = {
        locals: {
          user: {
            userId: 'thisisId'
          }
        },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      authService.sendOtpRequest.mockRejectedValue(mockError);
      await authController.sendOtpRequest(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Verify otp', () => {
    it('returns 200 status code with verified message', async () => {
      const mockRequest = {
        body: {
          otp: 'otp',
          email: 'Emilia'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      authService.verifyOtp.mockResolvedValue(undefined);
      await authController.verifyOtp(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'OTP verified successfully'
      });
    });

    it('throws application error when verification service throws fails', async () => {
      const mockError = new ApplicationError(
        'Error while checking reset password link',
        500
      );

      const mockRequest = {
        body: {
          otp: 'otp',
          email: 'Emilia'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      authService.verifyOtp.mockRejectedValue(mockError);
      await authController.verifyOtp(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when verification service throws fails', async () => {
      const mockError = new Error();

      const mockRequest = {
        body: {
          otp: 'otp',
          email: 'Emilia'
        }
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      authService.verifyOtp.mockRejectedValue(mockError);
      await authController.verifyOtp(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
