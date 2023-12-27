import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/**
 * @typedef {Record<
 *   keyof import('../../repositories/user-notification.js'),
 *   jest.Mock
 * >} UserNotificationRepositoryMock
 */
/** @typedef {Record<keyof import('../user-notification.js'), jest.Mock>} UserNotificationServiceMock */

jest.unstable_mockModule(
  '../../repositories/user-notification.js',
  () =>
    /** @type {UserNotificationRepositoryMock} */
    ({
      getUserNotification: jest.fn(),
      getUserNotificationById: jest.fn(),
      readAllNotification: jest.fn(),
      updateUserNotification: jest.fn(),
      createUserNotification: jest.fn(),
      destroyUserNotification: jest.fn()
    })
);

const userNotificationRepository =
  /** @type {UserNotificationRepositoryMock} */ (
    await import('../../repositories/user-notification.js')
  );

const userNotificationService = /** @type {UserNotificationServiceMock} */ (
  await import('../user-notification.js')
);

describe('User Notifications Service', () => {
  describe('getUserNotification', () => {
    it('returns the expected notification when the repository returns a notification', async () => {
      const mockNotification = { id: '1', message: 'Test notification' };
      userNotificationRepository.getUserNotification.mockResolvedValue(
        // @ts-ignore
        mockNotification
      );

      const notification =
        await userNotificationService.getUserNotification('1');

      expect(notification).toEqual(mockNotification);
    });

    it('throws application error when getting notification fails', async () => {
      const mockError = new ApplicationError(
        'Failed to get user notification',
        500
      );

      userNotificationRepository.getUserNotification.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(
        userNotificationService.getUserNotification({})
      ).rejects.toThrow(
        `Error while getting user notification: ${mockError.message}`
      );
    });
  });

  describe('getUserNotificationById', () => {
    it('returns the expected notification when the repository returns a notification', async () => {
      const mockNotification = { id: '1', message: 'Test notification' };
      userNotificationRepository.getUserNotificationById.mockResolvedValue(
        // @ts-ignore
        mockNotification
      );

      const notification =
        await userNotificationService.getUserNotificationById('1');

      expect(notification).toEqual(mockNotification);
    });

    it('throws an ApplicationError with status 404 when the repository returns null', async () => {
      userNotificationRepository.getUserNotificationById.mockResolvedValue(
        // @ts-ignore
        null
      );

      await expect(
        userNotificationService.getUserNotificationById('1')
      ).rejects.toThrow(
        'Error while getting user notification details: User notification not found'
      );
    });

    it('throws an error when the repository throws an error', async () => {
      const mockError = new ApplicationError(
        'Failed to get user notification',
        500
      );

      userNotificationRepository.getUserNotificationById.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(
        userNotificationService.getUserNotificationById({})
      ).rejects.toThrow(
        `Error while getting user notification details: ${mockError.message}`
      );
    });
  });

  describe('createUserNotification', () => {
    it('returns the expected notification when the repository creates a notification', async () => {
      const mockNotification = {
        id: '1',
        message: 'Test notification',
        user_id: '1'
      };
      const mockPayload = { message: 'Test notification' };
      userNotificationRepository.createUserNotification.mockResolvedValue(
        // @ts-ignore
        mockNotification
      );

      const notification = await userNotificationService.createUserNotification(
        '1',
        mockPayload
      );

      expect(notification).toEqual(mockNotification);
      expect(
        userNotificationRepository.createUserNotification
      ).toHaveBeenCalledWith({
        ...mockPayload,
        user_id: '1'
      });
    });

    it('throws an error when the repository throws an error', async () => {
      const mockError = new ApplicationError(
        'Failed to create user notification',
        500
      );

      userNotificationRepository.createUserNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(
        userNotificationService.createUserNotification({})
      ).rejects.toThrow(
        `Error while creating user notification: ${mockError.message}`
      );
    });
  });

  describe('readAllNotification', () => {
    it('returns the expected notifications when the repository returns notifications', async () => {
      const mockNotifications = [
        { id: '1', message: 'Test notification 1' },
        { id: '2', message: 'Test notification 2' }
      ];
      // @ts-ignore
      userNotificationRepository.readAllNotification.mockResolvedValue([
        null,
        mockNotifications
      ]);

      const notifications =
        await userNotificationService.readAllNotification('1');

      expect(notifications).toEqual(mockNotifications);
    });

    it('throws an error when the repository throws an error', async () => {
      const mockError = new ApplicationError(
        'Failed to get user notification',
        500
      );

      userNotificationRepository.readAllNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(
        userNotificationService.readAllNotification({})
      ).rejects.toThrow(
        `Error while getting user notifications: ${mockError.message}`
      );
    });
  });

  describe('updateUserNotification', () => {
    it('returns the expected notification when the repository updates a notification', async () => {
      const mockNotification = {
        id: '1',
        message: 'Updated test notification'
      };
      // @ts-ignore
      userNotificationRepository.updateUserNotification.mockResolvedValue([
        {},
        [mockNotification]
      ]);

      const notification =
        await userNotificationService.updateUserNotification('1');

      expect(notification).toEqual(mockNotification);
    });

    it('throws an error when the repository throws an error', async () => {
      const mockError = new ApplicationError(
        'Failed to update user notification',
        500
      );
      userNotificationRepository.updateUserNotification.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      await expect(
        userNotificationService.updateUserNotification('1')
      ).rejects.toThrow(
        `Error while updating user notifications: ${mockError.message}`
      );
    });
  });

  describe('Destroy user notification', () => {
    it('throws application error when destroying user notification fails', async () => {
      const mockError = new ApplicationError(
        'Failed to destroy user notification',
        500
      );

      userNotificationRepository.destroyUserNotification.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(
        userNotificationService.destroyUserNotification('1')
      ).rejects.toThrow(
        `Error while deleting user notifications: ${mockError.message}`
      );
    });
  });
});
