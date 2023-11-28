import { jest } from '@jest/globals';

/** @typedef {Record<keyof import('../validation.js'), jest.Mock>} ValidationMiddlewareMock */

const validationMiddleware = /** @type {ValidationMiddlewareMock} */ (
  await import('../validation.js')
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
});
