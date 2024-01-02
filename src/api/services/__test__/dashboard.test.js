import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../dashboard.js'), jest.Mock>} DashboardServiceMock */
/**
 * @typedef {Record<
 *   keyof import('../../repositories/dashboard.js'),
 *   jest.Mock
 * >} DashboardRepositoryMock
 */

jest.unstable_mockModule(
  '../../repositories/dashboard.js',
  () =>
    /** @type {DashboardRepositoryMock} */ ({
      getStatistics: jest.fn()
    })
);

const dashboardRepository = /** @type {DashboardRepositoryMock} */ (
  await import('../../repositories/dashboard.js')
);

const dashboardService = /** @type {DashboardServiceMock} */ (
  await import('../dashboard.js')
);

describe('Dashboard service', () => {
  describe('Get statistics', () => {
    it('returns statistic data', async () => {
      const mockStatistics = {
        total_users: 24,
        active_courses: 24,
        premium_courses: 24
      };

      // @ts-ignore
      dashboardRepository.getStatistics.mockResolvedValue(mockStatistics);
      const data = await dashboardService.getStatistics();

      expect(data).toEqual(mockStatistics);
    });

    it('throws application error when getting statistic fails', async () => {
      const mockError = new ApplicationError('Something wrong', 500);

      // @ts-ignore
      dashboardRepository.getStatistics.mockRejectedValue(mockError);
      await expect(dashboardService.getStatistics()).rejects.toThrow(
        'Error while getting statistics'
      );
    });
  });
});
