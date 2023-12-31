import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../user.js'), jest.Mock>} UserControllerMock */
/** @typedef {Record<keyof import('../../services/user.js'), jest.Mock>} UserServiceMock */
/** @typedef {Record<keyof import('../../services/auth.js'), jest.Mock>} AuthServiceMock */

jest.unstable_mockModule(
  '../../services/user.js',
  () =>
    /** @type {UserServiceMock} */
    ({
      updateUser: jest.fn(),
      getUserByEmail: jest.fn(),
      resetPasswordProfile: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../services/auth.js',
  () =>
    /** @type {AuthServiceMock} */
    ({
      hashPassword: jest.fn(),
      isPasswordMatch: jest.fn()
    })
);

const userController = /** @type {UserControllerMock} */ (
  await import('../user.js')
);

const userService = /** @type {UserServiceMock} */ (
  await import('../../services/user.js')
);

const authService = /** @type {AuthServiceMock} */ (
  await import('../../services/auth.js')
);

describe('User controller', () => {
  describe('Get current user', () => {
    it('should return 200 status code with same user data', () => {
      const mockUser = {
        name: 'Emilia'
      };

      const mockRequest = {};

      const mockResponse = {
        locals: { user: mockUser },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      userController.getCurrentUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockUser });
    });
  });

  describe('updateUser', () => {
    it('should update user profile successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Emilia'
      };

      // @ts-ignore
      userService.updateUser.mockResolvedValueOnce(mockUser);

      const mockRequest = {
        body: { name: 'Emilia' }
      };

      const mockResponse = {
        locals: {
          user: {
            id: '1'
          },
          image: 'image'
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userController.updateUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User profile updated successfully',
        data: mockUser
      });
    });

    it('should handle application error', async () => {
      const mockError = new ApplicationError('Failed to update course', 400);

      // @ts-ignore
      userService.updateUser.mockRejectedValueOnce(mockError);

      const mockRequest = {
        body: { name: 'Emilia' }
      };

      const mockResponse = {
        locals: {
          user: {
            id: '1'
          },
          image: 'image'
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userController.updateUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Failed to update course'
      });
    });

    it('should handle internal server error', async () => {
      const mockError = new Error();

      // @ts-ignore
      userService.updateUser.mockRejectedValueOnce(mockError);

      const mockRequest = {
        body: { name: 'Emilia' }
      };

      const mockResponse = {
        locals: {
          user: {
            id: '1'
          },
          image: 'image'
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userController.updateUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('resetPasswordProfile', () => {
    const mockGettingUser = {
      id: '1',
      name: 'Emilia',
      dataValues: {
        password: 'hashedOldPassword'
      }
    };

    const mockUser = {
      id: '1',
      name: 'Emilia',
      password: 'emilia-rezero'
    };

    const mockId = '123';
    const mockEmail = 'emilia@rezero.com';
    const mockPassword = 'password';
    const mockNewPassword = 'newPassword';
    const mockWrongPassword = 'wrongPassword';
    const mockHashedOldPassword = 'hashedOldPassword';

    it('should reset password on user profile', async () => {
      // @ts-ignore
      userService.getUserByEmail.mockResolvedValue(mockGettingUser);
      // @ts-ignore
      authService.isPasswordMatch.mockResolvedValue(true);
      // @ts-ignore
      authService.hashPassword.mockResolvedValue(mockNewPassword);
      // @ts-ignore
      userService.resetPasswordProfile.mockResolvedValue(mockUser);

      const mockRequest = {
        body: { old_password: mockPassword, new_password: mockNewPassword }
      };
      const mockResponse = {
        locals: { user: { id: mockId, email: mockEmail } },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userController.resetPasswordProfile(mockRequest, mockResponse);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(authService.isPasswordMatch).toHaveBeenCalledWith(
        mockPassword,
        mockHashedOldPassword
      );
      expect(authService.hashPassword).toHaveBeenCalledWith(mockNewPassword);
      expect(userService.resetPasswordProfile).toHaveBeenCalledWith(
        mockId,
        mockNewPassword
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password successfully updated',
        data: mockUser
      });
    });

    it('should handle old password mismatch', async () => {
      // @ts-ignore
      userService.getUserByEmail.mockResolvedValue(mockGettingUser);
      // @ts-ignore
      authService.isPasswordMatch.mockResolvedValue(false);

      const mockRequest = {
        body: { old_password: mockWrongPassword, new_password: mockNewPassword }
      };
      const mockResponse = {
        locals: { user: { id: mockId, email: mockEmail } },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userController.resetPasswordProfile(mockRequest, mockResponse);

      expect(authService.isPasswordMatch).toHaveBeenCalledWith(
        mockWrongPassword,
        mockHashedOldPassword
      );
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Old password is not match'
      });
    });

    it('throws application error when resetPasswordProfile fails', async () => {
      const mockError = new ApplicationError(
        'Failed to update user password',
        500
      );

      // @ts-ignore
      userService.getUserByEmail.mockRejectedValue(mockError);

      const mockRequest = {
        body: { old_password: mockPassword, new_password: mockNewPassword }
      };
      const mockResponse = {
        locals: { user: { id: mockId, email: mockEmail } },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await userController.resetPasswordProfile(mockRequest, mockResponse);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when resetPasswordProfile fails', async () => {
      const mockError = new Error();

      // @ts-ignore
      userService.getUserByEmail.mockRejectedValue(mockError);

      const mockRequest = {
        body: { old_password: mockPassword, new_password: mockNewPassword }
      };
      const mockResponse = {
        locals: { user: { id: mockId, email: mockEmail } },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await userController.resetPasswordProfile(mockRequest, mockResponse);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
