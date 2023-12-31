import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../../repositories/user.js'), jest.Mock>} UserRepositoryMock */
/** @typedef {Record<keyof import('../user.js'), jest.Mock>} UserServiceMock */
/** @typedef {Record<keyof import('../auth.js'), jest.Mock>} AuthServiceMock */
/** @typedef {Record<keyof import('../user-notification.js'), jest.Mock>} UserNotificationServiceMock */

jest.unstable_mockModule(
  '../../repositories/user.js',
  () =>
    /** @type {UserRepositoryMock} */ ({
      getUser: jest.fn(),
      getUserByEmail: jest.fn(),
      getUnverifiedUser: jest.fn(),
      getUserByPhoneNumber: jest.fn(),
      getAdminUserByEmail: jest.fn(),
      getAdminUserByPhoneNumber: jest.fn(),
      getVerifiedUserWithEmailAndPhoneNumber: jest.fn(),
      getUnverifiedUserByEmailAndPhoneNumber: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      destroyUser: jest.fn(),
      resetPasswordProfile: jest.fn()
    })
);

jest.unstable_mockModule(
  '../user-notification.js',
  () =>
    /** @type {UserNotificationServiceMock} */ ({
      createUserNotification: jest.fn()
    })
);

jest.unstable_mockModule(
  '../auth.js',
  () =>
    /** @type {AuthServiceMock} */ ({
      hashPassword: jest.fn(),
      sendOtpRequest: jest.fn()
    })
);

const userRepository = /** @type {UserRepositoryMock} */ (
  await import('../../repositories/user.js')
);

const authService = /** @type {AuthServiceMock} */ (await import('../auth.js'));

const userService = /** @type {UserServiceMock} */ (await import('../user.js'));

const userNotificationService = /** @type {UserNotificationServiceMock} */ (
  await import('../user-notification.js')
);

describe('User service', () => {
  describe('Get user', () => {
    it('returns user data', async () => {
      const mockUser = {
        dataValues: {
          id: '1',
          name: 'Emilia'
        }
      };

      userRepository.getUser.mockResolvedValue(
        /** @ts-ignore */
        mockUser
      );

      const user = await userService.getUser('1');

      expect(user).toEqual(mockUser);
    });

    it('throws application error when user is not found', async () => {
      const mockError = new ApplicationError('User not found', 404);

      userRepository.getUser.mockResolvedValue(
        /** @ts-ignore */
        null
      );

      await expect(userService.getUser('1')).rejects.toThrow(
        `Error while getting user: ${mockError.message}`
      );
    });

    it('throws application error when getting user fails', async () => {
      const mockError = new ApplicationError('Failed to get user', 500);

      userRepository.getUser.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(userService.getUser('1')).rejects.toThrow(
        `Error while getting user: ${mockError.message}`
      );
    });
  });

  describe('Get user by email', () => {
    it('returns user data', async () => {
      const mockUser = {
        dataValues: {
          id: '1',
          name: 'Emilia'
        }
      };

      userRepository.getUserByEmail.mockResolvedValue(
        /** @ts-ignore */
        mockUser
      );

      const user = await userService.getUserByEmail('email');

      expect(user).toEqual(mockUser);
    });

    it('throws application error when user is not found', async () => {
      const mockError = new ApplicationError('User not found', 404);

      userRepository.getUserByEmail.mockResolvedValue(
        /** @ts-ignore */
        null
      );

      await expect(userService.getUserByEmail('email')).rejects.toThrow(
        `Error while getting user: ${mockError.message}`
      );
    });

    it('throws application error when getting user fails', async () => {
      const mockError = new ApplicationError('Failed to get user', 500);

      userRepository.getUserByEmail.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(userService.getUserByEmail('email')).rejects.toThrow(
        `Error while getting user: ${mockError.message}`
      );
    });
  });

  describe('Get unverified user by email', () => {
    it('returns user data', async () => {
      const mockUser = {
        dataValues: {
          id: '1',
          name: 'Emilia'
        }
      };

      // @ts-ignore
      userRepository.getUnverifiedUser.mockResolvedValue(mockUser);

      const user = await userService.getUnverifiedUserByEmail('email');

      expect(userRepository.getUnverifiedUser).toHaveBeenCalledWith('email');
      expect(user).toEqual(mockUser);
    });

    it('throws application error when user is not found', async () => {
      const mockError = new ApplicationError('User not found', 404);

      userRepository.getUnverifiedUser.mockResolvedValue(
        /** @ts-ignore */
        null
      );

      await expect(
        userService.getUnverifiedUserByEmail('email')
      ).rejects.toThrow(`Error while getting user: ${mockError.message}`);
    });

    it('throws application error when getting user fails', async () => {
      const mockError = new ApplicationError('Failed to get user', 500);

      userRepository.getUnverifiedUser.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(
        userService.getUnverifiedUserByEmail('email')
      ).rejects.toThrow(`Error while getting user: ${mockError.message}`);
    });
  });

  describe('Get user by phone number', () => {
    it('returns user data', async () => {
      const mockUser = {
        dataValues: {
          id: '1',
          name: 'Emilia'
        }
      };

      userRepository.getUserByPhoneNumber.mockResolvedValue(
        /** @ts-ignore */
        mockUser
      );

      const user = await userService.getUserByPhoneNumber('phone_number');

      expect(user).toEqual(mockUser);
    });

    it('throws application error when user is not found', async () => {
      const mockError = new ApplicationError('User not found', 404);

      userRepository.getUserByPhoneNumber.mockResolvedValue(
        /** @ts-ignore */
        null
      );

      await expect(
        userService.getUserByPhoneNumber('phone_number')
      ).rejects.toThrow(`Error while getting user: ${mockError.message}`);
    });

    it('throws application error when getting user fails', async () => {
      const mockError = new ApplicationError('Failed to get user', 500);

      userRepository.getUserByPhoneNumber.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(
        userService.getUserByPhoneNumber('phone_number')
      ).rejects.toThrow(`Error while getting user: ${mockError.message}`);
    });
  });

  describe('Get admin user by email', () => {
    it('returns user data', async () => {
      const mockUser = {
        dataValues: {
          id: '1',
          name: 'Emilia'
        }
      };

      // @ts-ignore
      userRepository.getAdminUserByEmail.mockResolvedValue(mockUser);

      const user = await userService.getAdminUserByEmail('email');

      expect(userRepository.getAdminUserByEmail).toHaveBeenCalledWith('email');
      expect(user).toEqual(mockUser);
    });

    it('throws application error when user is not found', async () => {
      const mockError = new ApplicationError('User not found', 404);

      userRepository.getAdminUserByEmail.mockResolvedValue(
        /** @ts-ignore */
        null
      );

      await expect(userService.getAdminUserByEmail('email')).rejects.toThrow(
        `Error while getting user: ${mockError.message}`
      );
    });

    it('throws application error when getting user fails', async () => {
      const mockError = new ApplicationError('Failed to get user', 500);

      userRepository.getAdminUserByEmail.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(userService.getAdminUserByEmail('email')).rejects.toThrow(
        `Error while getting user: ${mockError.message}`
      );
    });
  });

  describe('Get admin user by phone number', () => {
    it('returns user data', async () => {
      const mockUser = {
        dataValues: {
          id: '1',
          name: 'Emilia'
        }
      };

      // @ts-ignore
      userRepository.getAdminUserByPhoneNumber.mockResolvedValue(mockUser);

      const user = await userService.getAdminUserByPhoneNumber('phoneNumber');

      expect(userRepository.getAdminUserByPhoneNumber).toHaveBeenCalledWith(
        'phoneNumber'
      );
      expect(user).toEqual(mockUser);
    });

    it('throws application error when user is not found', async () => {
      const mockError = new ApplicationError('User not found', 404);

      userRepository.getAdminUserByPhoneNumber.mockResolvedValue(
        /** @ts-ignore */
        null
      );

      await expect(
        userService.getAdminUserByPhoneNumber('phoneNumber')
      ).rejects.toThrow(`Error while getting user: ${mockError.message}`);
    });

    it('throws application error when getting user fails', async () => {
      const mockError = new ApplicationError('Failed to get user', 500);

      userRepository.getAdminUserByPhoneNumber.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(
        userService.getAdminUserByPhoneNumber('phoneNumber')
      ).rejects.toThrow(`Error while getting user: ${mockError.message}`);
    });
  });

  describe('Create user', () => {
    it('should create a new user and return user data', async () => {
      const mockUser = {
        email: 'emilia@rezero.com',
        phone_number: '0123',
        password: 'emilia-rezero',
        dataValues: { id: '1' }
      };
      const mockEncryptedPassword = 'EncryptedPassword';
      const mockUserWithEncryptedPasswordAndAdmin = {
        ...mockUser,
        admin: false,
        password: mockEncryptedPassword
      };
      const mockNotification = {
        id: '1',
        name: 'Notifikasi',
        description: 'Selamat datang di Learnify!'
      };

      // @ts-ignore
      authService.hashPassword.mockResolvedValue(mockEncryptedPassword);
      userRepository.getVerifiedUserWithEmailAndPhoneNumber.mockResolvedValue(
        // @ts-ignore
        null
      );
      userRepository.getUnverifiedUserByEmailAndPhoneNumber.mockResolvedValue(
        // @ts-ignore
        null
      );
      userRepository.createUser.mockResolvedValue(
        // @ts-ignore
        mockUserWithEncryptedPasswordAndAdmin
      );

      // @ts-ignore
      authService.sendOtpRequest.mockResolvedValue(Function);
      userNotificationService.createUserNotification.mockResolvedValue(
        // @ts-ignore
        mockNotification
      );

      const userResult = await userService.createUser(mockUser);

      expect(userResult).toEqual(mockUserWithEncryptedPasswordAndAdmin);
      expect(userResult).toMatchObject({ admin: false });
    });

    it('throw an application error for existing verified user by email', async () => {
      const mockError = new ApplicationError('Email already exist', 409);
      const mockUser = {
        email: 'emilia@rezero.com',
        phone_number: '0123',
        password: 'emilia-rezero',
        dataValues: { id: '1' }
      };
      const mockVerifiedUser = { dataValues: { email: 'emilia@rezero.com' } };

      userRepository.getVerifiedUserWithEmailAndPhoneNumber.mockResolvedValue(
        // @ts-ignore
        mockVerifiedUser
      );

      await expect(userService.createUser(mockUser)).rejects.toThrow(
        `Error while creating user: ${mockError.message}`
      );
    });

    it('throw an application error for existing verified user by phone number', async () => {
      const mockError = new ApplicationError(
        'Phone number already exists',
        409
      );
      const mockUser = {
        email: 'emilia@rezero.com',
        phone_number: '0123',
        password: 'emilia-rezero',
        dataValues: { id: '1' }
      };
      const mockVerifiedUser = { dataValues: { phone_number: '0123' } };

      userRepository.getVerifiedUserWithEmailAndPhoneNumber.mockResolvedValue(
        // @ts-ignore
        mockVerifiedUser
      );

      await expect(userService.createUser(mockUser)).rejects.toThrow(
        `Error while creating user: ${mockError.message}`
      );
    });

    it('should update an existing unverified user and return user data', async () => {
      const mockUser = {
        email: 'emilia@rezero.com',
        phone_number: '0123',
        password: 'emilia-rezero',
        dataValues: { id: '1' }
      };
      const mockEncryptedPassword = 'EncryptedPassword';
      const mockUserWithEncryptedPasswordAndAdmin = {
        ...mockUser,
        admin: false,
        password: mockEncryptedPassword
      };
      const mockNotification = {
        id: '1',
        name: 'Notifikasi',
        description: 'Selamat datang di Learnify!'
      };

      // @ts-ignore
      authService.hashPassword.mockResolvedValue(mockEncryptedPassword);
      userRepository.getVerifiedUserWithEmailAndPhoneNumber.mockResolvedValue(
        // @ts-ignore
        null
      );
      userRepository.getUnverifiedUserByEmailAndPhoneNumber.mockResolvedValue(
        // @ts-ignore
        mockUser
      );
      // @ts-ignore
      userRepository.updateUser.mockResolvedValue([
        null,
        [mockUserWithEncryptedPasswordAndAdmin]
      ]);

      // @ts-ignore
      authService.sendOtpRequest.mockResolvedValue(Function);
      userNotificationService.createUserNotification.mockResolvedValue(
        // @ts-ignore
        mockNotification
      );

      const userResult = await userService.createUser(mockUser);

      expect(userRepository.updateUser).toHaveBeenCalledWith('1', {
        ...mockUser,
        password: 'EncryptedPassword'
      });
      expect(userResult).toEqual(mockUserWithEncryptedPasswordAndAdmin);
    });

    it('throws application error when creating user fails', async () => {
      const mockError = new ApplicationError('Failed to create user', 500);

      // @ts-ignore
      authService.hashPassword.mockResolvedValue(null);
      userRepository.getVerifiedUserWithEmailAndPhoneNumber.mockResolvedValue(
        // @ts-ignore
        null
      );
      userRepository.getUnverifiedUserByEmailAndPhoneNumber.mockResolvedValue(
        // @ts-ignore
        null
      );
      // @ts-ignore
      userRepository.createUser.mockRejectedValue(mockError);

      await expect(userService.createUser({})).rejects.toThrow(
        `Error while creating user: ${mockError.message}`
      );
    });
  });

  describe('Update user', () => {
    it('returns user data', async () => {
      const mockUser = {
        id: '1',
        name: 'Emilia'
      };

      // @ts-ignore
      userRepository.updateUser.mockResolvedValue([
        null,
        [{ dataValues: mockUser }]
      ]);

      const userResult = await userService.updateUser(mockUser);

      expect(userResult).toEqual(mockUser);
    });

    it('throws application error when updating user fails', async () => {
      const mockError = new ApplicationError('Failed to update user', 500);

      userRepository.updateUser.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(userService.updateUser({})).rejects.toThrow(
        `Error while updating user: ${mockError.message}`
      );
    });
  });

  describe('Destroy user', () => {
    it('returns user data', async () => {
      const mockUser = {
        id: '1',
        name: 'Emilia'
      };

      userRepository.destroyUser.mockResolvedValue(
        /** @ts-ignore */
        mockUser
      );

      const userResult = await userService.destroyUser(mockUser);

      expect(userResult).toEqual(mockUser);
    });

    it('throws application error when destroying user fails', async () => {
      const mockError = new ApplicationError('Failed to destroy user', 500);

      userRepository.destroyUser.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(userService.destroyUser('1')).rejects.toThrow(
        `Error while deleting user: ${mockError.message}`
      );
    });
  });

  describe('reset password on profile', () => {
    it('should reset the password and return the updated password data', async () => {
      const mockResetPasswordData = {
        id: '1',
        name: 'Emilia',
        password: 'emilia-rezero'
      };

      const mockId = '1';
      const mockNewPassword = 'newPassword';

      // @ts-ignore
      userRepository.resetPasswordProfile.mockResolvedValue([
        null,
        [mockResetPasswordData]
      ]);

      const resetPassword = await userService.resetPasswordProfile(
        mockId,
        mockNewPassword
      );

      expect(userRepository.resetPasswordProfile).toHaveBeenCalledWith(
        mockId,
        mockNewPassword
      );
      expect(resetPassword).toEqual(mockResetPasswordData);
    });

    it('throws an error when reset password fails', async () => {
      const mockError = new ApplicationError(
        'Failed to reset password on profile',
        500
      );
      userRepository.resetPasswordProfile.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(
        userService.resetPasswordProfile('1', 'newPassword')
      ).rejects.toThrow(
        `Error while resetting password profile: ${mockError.message}`
      );
    });
  });
});
