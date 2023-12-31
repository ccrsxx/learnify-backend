import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/**
 * @typedef {Record<
 *   keyof import('../../repositories/course-material-status.js'),
 *   jest.Mock
 * >} CourseMaterialStatusRepositoryMock
 */
/** @typedef {Record<keyof import('../course-material-status.js'), jest.Mock>} CourseMaterialStatusServiceMock */

jest.unstable_mockModule(
  '../../repositories/course-material-status.js',
  () =>
    /** @type {CourseMaterialStatusRepositoryMock} */
    ({
      setCourseMaterialStatus: jest.fn(),
      getCourseMaterialStatusById: jest.fn(),
      backfillCourseMaterialStatus: jest.fn(),
      updateCourseMaterialStatus: jest.fn()
    })
);

const courseMaterialStatusRepository =
  /** @type {CourseMaterialStatusRepositoryMock} */ (
    await import('../../repositories/course-material-status.js')
  );

const courseMaterialStatusService =
  /** @type {CourseMaterialStatusServiceMock} */ (
    await import('../course-material-status.js')
  );

describe('Course Material Status Service', () => {
  describe('getCourseMaterialStatusById', () => {
    it('returns the expected course material status when the repository returns a status', async () => {
      const mockStatus = { id: '1', status: 'Test status' };
      courseMaterialStatusRepository.getCourseMaterialStatusById.mockResolvedValue(
        // @ts-ignore
        mockStatus
      );

      const status =
        await courseMaterialStatusService.getCourseMaterialStatusById('1');

      expect(status).toEqual(mockStatus);
    });

    it('throws an ApplicationError with status 404 when the repository returns null', async () => {
      courseMaterialStatusRepository.getCourseMaterialStatusById.mockResolvedValue(
        // @ts-ignore
        null
      );

      await expect(
        courseMaterialStatusService.getCourseMaterialStatusById('1')
      ).rejects.toThrow('Course material status not found');
    });

    it('throws an error when the repository throws an error', async () => {
      const mockError = new ApplicationError(
        'Failed to get course material status',
        500
      );

      courseMaterialStatusRepository.getCourseMaterialStatusById.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(
        courseMaterialStatusService.getCourseMaterialStatusById('1')
      ).rejects.toThrow('Error while getting course material status details');
    });
  });

  describe('updateCourseMaterialStatus', () => {
    it('returns the updated course material status when the repository updates successfully', async () => {
      const mockStatus = { id: '1', status: 'Updated status' };
      courseMaterialStatusRepository.updateCourseMaterialStatus.mockResolvedValue(
        // @ts-ignore
        [[], [mockStatus]]
      );

      const status =
        await courseMaterialStatusService.updateCourseMaterialStatus('1');

      expect(status).toEqual(mockStatus);
    });

    it('throws an ApplicationError with status 500 when the repository throws an error', async () => {
      const mockError = new Error('Failed to update course material status');
      courseMaterialStatusRepository.updateCourseMaterialStatus.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(
        courseMaterialStatusService.updateCourseMaterialStatus('1')
      ).rejects.toThrow('Error while updating course material status');
    });
  });
});
