import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../dashboard.js'), jest.Mock>} DashboardControllerMock */
/** @typedef {Record<keyof import('../../services/dashboard.js'), jest.Mock>} DashboardServiceMock */

jest.unstable_mockModule(
  '../../services/dashboard.js',
  () =>
    /** @type {DashboardServiceMock} */
    ({
      getStatistics: jest.fn()
    })
);

const dashboardController = /** @type {DashboardControllerMock} */ (
  await import('../dashboard.js')
);
const dashboardService = /** @type {DashboardServiceMock} */ (
  await import('../../services/dashboard.js')
);

describe('Dashboard controller', () => {
  describe('Get Statistics', () => {
    it('returns 200 status code with statistics data', async () => {
      const mockStatistic = {
        total_user: 24,
        active_courses: 24,
        premium_courses: 24
      };
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      dashboardService.getStatistics.mockReturnValue(mockStatistic);
      await dashboardController.getStatistics(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockStatistic
      });
    });

    it('throws application error when dashboard service throws fails', async () => {
      const mockError = new ApplicationError('Data not found', 404);

      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      dashboardService.getStatistics.mockRejectedValue(mockError);
      await dashboardController.getStatistics(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when dashboard service throws fails', async () => {
      const mockError = new Error();

      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      dashboardService.getStatistics.mockRejectedValue(mockError);
      await dashboardController.getStatistics(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
