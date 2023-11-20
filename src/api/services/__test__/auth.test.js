import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {{ default: Record<keyof import('bcrypt'), jest.Mock> }} BcryptMock */
/** @typedef {{ default: Record<keyof import('jsonwebtoken'), jest.Mock> }} JWTMock */
/** @typedef {Record<keyof import('../../services/user.js'), jest.Mock>} UserServiceMock */
/** @typedef {Record<keyof import('../../services/auth.js'), jest.Mock>} AuthServiceMock */

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
      getUser: jest.fn()
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
