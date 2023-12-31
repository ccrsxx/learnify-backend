import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../user-notification.js'), jest.Mock>} UserNotificationControllerMock */
/**
 * @typedef {Record<
 *   keyof import('../../services/user-notification.js'),
 *   jest.Mock
 * >} UserNotificationServiceMock
 */

jest.unstable_mockModule(
  '../../services/user-notification.js',
  () =>
    /** @type {UserNotificationServiceMock} */
    ({
      getUserNotification: jest.fn(),
      getUserNotificationById: jest.fn(),
      readAllNotification: jest.fn(),
      updateUserNotification: jest.fn(),
      createUserNotification: jest.fn(),
      destroyUserNotification: jest.fn()
    })
);

const userNotificationController =
  /** @type {UserNotificationControllerMock} */ (
    await import('../user-notification.js')
  );

const userNotificationService = /** @type {UserNotificationServiceMock} */ (
  await import('../../services/user-notification.js')
);

describe('User notification controller', () => {
  describe('getUserNotification', () => {
    it('should return user notification', async () => {
      const mockNotification = { id: 1, message: 'Test notification' };
      userNotificationService.getUserNotification.mockResolvedValue(
        // @ts-ignore
        mockNotification
      );
      const mockRequest = {};
      const mockResponse = {
        locals: { user: {} },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.getUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockNotification
      });
    });

    it('throws application error when getUserNotification fails', async () => {
      const mockError = new ApplicationError(
        'Failed to get user notification',
        500
      );

      userNotificationService.getUserNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {};

      const mockResponse = {
        locals: { user: {} },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      await userNotificationController.getUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when getUserNotification fails', async () => {
      const mockError = new Error();

      userNotificationService.getUserNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {};

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // @ts-ignore
      await userNotificationController.getUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('readAllNotification', () => {
    it('should return all notifications as read', async () => {
      const mockNotification = { id: 1, message: 'Test notification' };
      userNotificationService.readAllNotification.mockResolvedValue(
        // @ts-ignore
        mockNotification
      );
      const mockRequest = {};
      const mockResponse = {
        locals: { user: { id: 1 } },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.readAllNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'All notifications have been read',
        data: mockNotification
      });
    });

    it('throws application error when readAllNotification fails', async () => {
      const mockError = new ApplicationError(
        'Failed to read all notifications',
        500
      );
      // @ts-ignore
      userNotificationService.readAllNotification.mockRejectedValue(mockError);
      const mockRequest = {};
      const mockResponse = {
        locals: { user: { id: 1 } },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.readAllNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when readAllNotification fails', async () => {
      const mockError = new Error();
      // @ts-ignore
      userNotificationService.readAllNotification.mockRejectedValue(mockError);
      const mockRequest = {};
      const mockResponse = {
        locals: { user: { id: 1 } },
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.readAllNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('updateUserNotification', () => {
    it('should update user notification successfully', async () => {
      const mockNotification = { id: 1, message: 'Test notification' };
      userNotificationService.updateUserNotification.mockResolvedValue(
        // @ts-ignore
        mockNotification
      );
      const mockRequest = { params: { id: 1 } };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.updateUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User notification updated successfully',
        data: mockNotification
      });
    });

    it('throws application error when updateUserNotification fails', async () => {
      const mockError = new ApplicationError(
        'Failed to update user notification',
        500
      );
      userNotificationService.updateUserNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );
      const mockRequest = { params: { id: 1 } };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.updateUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when updateUserNotification fails', async () => {
      const mockError = new Error();
      userNotificationService.updateUserNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );
      const mockRequest = { params: { id: 1 } };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.updateUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('destroyUserNotification', () => {
    it('should delete user notification successfully', async () => {
      // @ts-ignore
      userNotificationService.destroyUserNotification.mockResolvedValue();
      const mockRequest = { params: { id: 1 } };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.destroyUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User notification deleted successfully'
      });
    });

    it('throws application error when destroyUserNotification fails', async () => {
      const mockError = new ApplicationError(
        'Failed to delete user notification',
        500
      );
      userNotificationService.destroyUserNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );
      const mockRequest = { params: { id: 1 } };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.destroyUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when destroyUserNotification fails', async () => {
      const mockError = new Error();
      userNotificationService.destroyUserNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );
      const mockRequest = { params: { id: 1 } };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userNotificationController.destroyUserNotification(
        mockRequest,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
