import { jest } from '@jest/globals';

const mockPublicUrl = 'https://dev.risalamin.com';

jest.unstable_mockModule('../../../libs/env.js', () => ({
  PUBLIC_URL: mockPublicUrl
}));

const indexController = await import('../index.js');

describe('Index controller', () => {
  describe('Welcome message', () => {
    it('should return 200 status code with message and documentation link', () => {
      const mockRequest = {};

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      indexController.ping(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Ping successfully bikin baru',
        documentation: `${mockPublicUrl}/docs`
      });
    });
  });
});
