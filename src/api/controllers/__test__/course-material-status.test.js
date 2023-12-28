import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../course-material-status.js'), jest.Mock>} CourseMaterialStatusControllerMock */
/**
 * @typedef {Record<
 *   keyof import('../../services/course-material-status.js'),
 *   jest.Mock
 * >} CourseMaterialStatusServiceMock
 */

jest.unstable_mockModule(
  '../../services/course-material-status.js',
  () =>
    /** @type */
    ({
      getCourseMaterialStatusById: jest.fn(),
      updateCourseMaterialStatus: jest.fn()
    })
);

const courseMaterialStatusController =
  /** @type {CourseMaterialStatusControllerMock} */ (
    await import('../course-material-status.js')
  );

const courseMaterialStatusService =
  /** @type {CourseMaterialStatusServiceMock} */ (
    await import('../../services/course-material-status.js')
  );

describe('Course Material Status Controller', () => {
  describe('updateCourseMaterialStatus', () => {
    it('should update course material status successfully', async () => {
      const mockReq = {
        params: { id: 'test-id' }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockCourseMaterialStatus = {
        /* your mock data here */
      };

      courseMaterialStatusService.updateCourseMaterialStatus.mockResolvedValue(
        // @ts-ignore
        mockCourseMaterialStatus
      );

      await courseMaterialStatusController.updateCourseMaterialStatus(
        mockReq,
        mockRes
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Course material status updated successfully',
        data: mockCourseMaterialStatus
      });
    });

    it('should handle ApplicationError correctly', async () => {
      const mockReq = {
        params: { id: 'test-id' }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockError = new ApplicationError('Test error', 400);

      courseMaterialStatusService.updateCourseMaterialStatus.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await courseMaterialStatusController.updateCourseMaterialStatus(
        mockReq,
        mockRes
      );

      expect(mockRes.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
    });

    it('should handle unexpected errors correctly', async () => {
      const mockReq = {
        params: { id: 'test-id' }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockError = new Error('Test error');

      courseMaterialStatusService.updateCourseMaterialStatus.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await courseMaterialStatusController.updateCourseMaterialStatus(
        mockReq,
        mockRes
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
