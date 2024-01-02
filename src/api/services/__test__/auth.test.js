import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';
import { sequelize } from '../../models/index.js';

/** @typedef {{ default: Record<keyof import('bcrypt'), jest.Mock> }} BcryptMock */
/** @typedef {{ default: Record<keyof import('jsonwebtoken'), jest.Mock> }} JWTMock */
/** @typedef {Record<keyof import('../../services/user.js'), jest.Mock>} UserServiceMock */
/** @typedef {Record<keyof import('../../../libs/mail.js'), jest.Mock>} EmailHelper */
/** @typedef {Record<keyof import('../../services/auth.js'), jest.Mock>} AuthServiceMock */
/** @typedef {Record<keyof import('../../repositories/otp.js'), jest.Mock>} OtpRepositoryMock */
/**
 * @typedef {Record<
 *   keyof import('../../repositories/password-reset.js'),
 *   jest.Mock
 * >} AuthRepositoryMock
 */
/** @typedef {Record<keyof import('../../repositories/user.js'), jest.Mock>} UserRepositoryMock */

jest.unstable_mockModule(
  'bcrypt',
  () =>
    /** @type {BcryptMock} */ ({
      default: {
        hash: jest.fn(),
        compare: jest.fn()
      }
    })
);

jest.unstable_mockModule(
  'jsonwebtoken',
  () =>
    /** @type {JWTMock} */ ({
      default: {
        sign: jest.fn(),
        verify: jest.fn()
      }
    })
);

jest.unstable_mockModule(
  '../../services/user.js',
  () =>
    /** @type {UserServiceMock} */
    ({
      getUser: jest.fn(),
      getUserByEmail: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../repositories/password-reset.js',
  () =>
    /** @type {AuthRepositoryMock} */
    ({
      setUsedTrueByUserId: jest.fn(),
      setPasswordReset: jest.fn(),
      getDataPasswordResetByToken: jest.fn(),
      updateUsedPasswordResetLink: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../repositories/user.js',
  () =>
    /** @type {UserRepositoryMock} */
    ({
      updateUser: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../repositories/otp.js',
  () =>
    /** @type {OtpRepositoryMock} */
    ({
      setOtpVerification: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../../libs/mail.js',
  () =>
    /** @type {EmailHelper} */
    ({
      sendResetPasswordEmail: jest.fn(),
      sendOtpEmail: jest.fn()
    })
);

const bcrypt = /** @type {BcryptMock} */ (
  /** @type {unknown} */ (await import('bcrypt'))
);

const jwt = /** @type {JWTMock} */ (
  /** @type {unknown} */ (await import('jsonwebtoken'))
);

const authService = /** @type {AuthServiceMock} */ (
  await import('../../services/auth.js')
);

const userService = /** @type {UserServiceMock} */ (
  await import('../../services/user.js')
);

const passwordResetRepository = /** @type {AuthRepositoryMock} */ (
  await import('../../repositories/password-reset.js')
);

// const userRepository = /** @type {UserRepositoryMock} */ (
//   await import('../../repositories/user.js')
// );

const emailHelper = /** @type {EmailHelper} */ (
  await import('../../../libs/mail.js')
);

describe('Auth service', () => {
  describe('Hash password', () => {
    it('returns hashed password', async () => {
      const mockPassword = 'password';
      const mockHashedPassword = 'hashedPassword';

      bcrypt.default.hash.mockResolvedValue(
        // @ts-ignore
        mockHashedPassword
      );

      const hashedPassword = await authService.hashPassword(mockPassword);

      expect(hashedPassword).toBe(mockHashedPassword);
    });

    it('throws application error when hashing fails', async () => {
      const mockError = new ApplicationError('Hashing failed', 500);

      const mockPassword = 'password';

      bcrypt.default.hash.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(authService.hashPassword(mockPassword)).rejects.toThrow(
        `Error while hashing password: ${mockError.message}`
      );
    });
  });

  describe('Is password match', () => {
    it('returns true when password match', async () => {
      const mockPassword = 'password';
      const mockHashedPassword = 'hashedPassword';

      bcrypt.default.compare.mockResolvedValue(
        // @ts-ignore
        true
      );

      const isMatch = await authService.isPasswordMatch(
        mockPassword,
        mockHashedPassword
      );

      expect(isMatch).toBe(true);
    });

    it('returns false when password does not match', async () => {
      const mockPassword = 'password';
      const mockHashedPassword = 'hashedPassword';

      bcrypt.default.compare.mockResolvedValue(
        // @ts-ignore
        false
      );

      const isMatch = await authService.isPasswordMatch(
        mockPassword,
        mockHashedPassword
      );

      expect(isMatch).toBe(false);
    });

    it('throws application error when comparing fails', async () => {
      const mockError = new ApplicationError('Comparing failed', 500);

      const mockPassword = 'password';
      const mockHashedPassword = 'hashedPassword';

      bcrypt.default.compare.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(
        authService.isPasswordMatch(mockPassword, mockHashedPassword)
      ).rejects.toThrow(`Error while comparing password: ${mockError.message}`);
    });
  });

  describe('Generate token', () => {
    it('returns token', async () => {
      jwt.default.sign.mockReturnValue('token');

      const token = await authService.generateToken('id');

      expect(token).toBe('token');
    });

    it('throws application error when generating token fails', async () => {
      const mockError = new ApplicationError('Generating token failed', 500);

      jwt.default.sign.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(authService.generateToken('id')).rejects.toThrow(
        `Error while generating token: ${mockError.message}`
      );
    });
  });

  describe('Verify token', () => {
    it('returns user', async () => {
      const mockUser = {
        id: '1',
        name: 'Emilia'
      };

      jwt.default.verify.mockResolvedValue(
        // @ts-ignore
        mockUser
      );

      userService.getUser.mockResolvedValue(
        // @ts-ignore
        mockUser
      );

      const user = await authService.verifyToken('token');

      expect(user).toBe(mockUser);
    });

    it('throws application error when verifying token fails', async () => {
      const mockError = new ApplicationError('Verifying token failed', 500);

      jwt.default.verify.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(authService.verifyToken('token')).rejects.toThrow(
        `Error while verifying token: ${mockError.message}`
      );
    });
  });
});

describe('Send verify to reset password', () => {
  it('records reset password request and send to email', async () => {
    const mockEmail = 'email@gmail.com';

    const mockUser = {
      dataValues: { id: 'emilia' },
      email: mockEmail,
      name: 'Emilia'
    };

    const mockToken = {
      dataValues: { id: 'fa757f35-384f-4050-a9c5-a86831a6a111' }
    };

    // @ts-ignore
    userService.getUserByEmail.mockResolvedValue(mockUser);
    // @ts-ignore
    passwordResetRepository.setUsedTrueByUserId.mockResolvedValue(undefined);
    // @ts-ignore
    passwordResetRepository.setPasswordReset.mockResolvedValue(mockToken);
    // @ts-ignore
    emailHelper.sendResetPasswordEmail.mockResolvedValue(undefined);

    sequelize.transaction = jest.fn(async (callback) => {
      // @ts-ignore
      return await callback();
    });

    expect(
      await authService.sendVerifyToResetPassword(mockEmail)
    ).toBeUndefined();
  });

  it('throws application error when sending verification fails', async () => {
    const mockError = new ApplicationError('Verification failed', 500);

    // @ts-ignore
    passwordResetRepository.setPasswordReset.mockRejectedValue(mockError);

    await expect(authService.sendVerifyToResetPassword()).rejects.toThrow(
      `Error while creating reset password link: ${mockError.message}`
    );
  });

  it('throws application error when user not found', async () => {
    const mockError = new ApplicationError('User not found', 404);
    const mockEmail = 'email@gmail.com';

    // @ts-ignore
    userService.getUserByEmail.mockResolvedValue(undefined);

    await expect(
      authService.sendVerifyToResetPassword(mockEmail)
    ).rejects.toThrow(
      `Error while creating reset password link: ${mockError.message}`
    );
  });
});

describe('Check link to reset password', () => {
  it('returns reset password data request', async () => {
    const mockToken = {
      dataValues: { id: 'fa757f35-384f-4050-a9c5-a86831a6a111' }
    };

    const mockResetPasswordData = {
      dataValues: {
        id: mockToken.dataValues.id,
        used: false
      }
    };

    passwordResetRepository.getDataPasswordResetByToken.mockResolvedValue(
      // @ts-ignore
      mockResetPasswordData
    );

    const data = await authService.checkLinkToResetPassword(mockToken);
    expect(data).toBe(mockResetPasswordData);
  });

  it('throws application error when checking verification fails', async () => {
    const mockError = new ApplicationError('Verification invalid', 500);

    passwordResetRepository.getDataPasswordResetByToken.mockResolvedValue(
      // @ts-ignore
      undefined
    );

    await expect(authService.checkLinkToResetPassword()).rejects.toThrow(
      `Error while checking reset password link: ${mockError.message}`
    );
  });

  it('throws application error when checking verification fails', async () => {
    const mockError = new ApplicationError('Verification invalid', 500);

    passwordResetRepository.getDataPasswordResetByToken.mockRejectedValue(
      // @ts-ignore
      mockError
    );

    await expect(authService.checkLinkToResetPassword()).rejects.toThrow(
      `Error while checking reset password link: ${mockError.message}`
    );
  });
});

describe('Change password', () => {
  it('throws application error when changing password fails', async () => {
    const mockError = new ApplicationError(
      'Error while checking reset password link: Verification invalid',
      500
    );
    const mockPayload = {
      token: 'fa757f35-384f-4050-a9c5-a86831a6a111',
      password: 'newPassword'
    };
    passwordResetRepository.updateUsedPasswordResetLink.mockRejectedValue(
      // @ts-ignore
      mockError
    );

    await expect(authService.changePassword(mockPayload)).rejects.toThrow(
      `Error changing password: ${mockError.message}`
    );
  });
});
