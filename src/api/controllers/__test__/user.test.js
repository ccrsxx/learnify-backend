import { jest } from '@jest/globals';
import * as carController from '../user.js';

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
      carController.getCurrentUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockUser });
    });
  });
});
