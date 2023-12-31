import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../../models/index.js';

/**
 * @typedef {Record<
 *   keyof import('../../repositories/user-payment.js'),
 *   jest.Mock
 * >} UserPaymentRepositoryMock
 */
/**
 * @typedef {Record<
 *   keyof import('../../repositories/user-course.js'),
 *   jest.Mock
 * >} UserCourseRepositoryMock
 */
/**
 * @typedef {Record<
 *   keyof import('../../repositories/course-material.js'),
 *   jest.Mock
 * >} CourseMaterialRepositoryMock
 */
/**
 * @typedef {Record<
 *   keyof import('../../repositories/course-material-status.js'),
 *   jest.Mock
 * >} CourseMaterialStatusRepositoryMock
 */
/** @typedef {Record<keyof import('../user-notification.js'), jest.Mock>} UserNotificationServiceMock */
/** @typedef {Record<keyof import('../user-payment.js'), jest.Mock>} UserPaymentServiceMock */

jest.unstable_mockModule(
  '../../repositories/user-payment.js',
  () =>
    /** @type {UserPaymentRepositoryMock} */
    ({
      getPayments: jest.fn(),
      getPendingPaymentByUserIdAndCourseId: jest.fn(),
      getPaymentsHistory: jest.fn(),
      getUserPaymentById: jest.fn(),
      updatePayCourse: jest.fn(),
      payCourse: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../repositories/user-course.js',
  () =>
    /** @type {UserCourseRepositoryMock} */
    ({
      getUserCourseByUserIdAndCourseId: jest.fn(),
      createUserCourse: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../repositories/course-material.js',
  () =>
    /** @type {CourseMaterialRepositoryMock} */
    ({
      getCourseMaterialByCourseId: jest.fn()
    })
);

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

jest.unstable_mockModule(
  '../user-notification.js',
  () =>
    /** @type {UserNotificationServiceMock} */
    ({
      createUserNotification: jest.fn()
    })
);

const userCourseRepository = /** @type {UserCourseRepositoryMock} */ (
  await import('../../repositories/user-course.js')
);

const courseMaterialRepository = /** @type {CourseMaterialRepositoryMock} */ (
  await import('../../repositories/course-material.js')
);

const userPaymentRepository = /** @type {UserPaymentRepositoryMock} */ (
  await import('../../repositories/user-payment.js')
);

const userPaymentService = /** @type {UserPaymentServiceMock} */ (
  await import('../user-payment.js')
);

const userNotificationService = /** @type {UserNotificationServiceMock} */ (
  await import('../user-notification.js')
);

const courseMaterialStatusRepository =
  /** @type {CourseMaterialStatusRepositoryMock} */ (
    await import('../../repositories/course-material-status.js')
  );

describe('Payment Service', () => {
  describe('getPayments', () => {
    it('returns the expected payments when the repository returns payments', async () => {
      const mockPayments = [
        { id: '1', price: 100 },
        { id: '2', price: 200 }
      ];
      // @ts-ignore
      userPaymentRepository.getPayments.mockResolvedValue(mockPayments);

      const payments = await userPaymentService.getPayments();

      expect(payments).toEqual(mockPayments);
    });

    it('throws application error when getting payments fails', async () => {
      const mockError = new ApplicationError('Failed to get payments', 500);
      // @ts-ignore
      userPaymentRepository.getPayments.mockRejectedValue(mockError);

      await expect(userPaymentService.getPayments()).rejects.toThrow(
        `Error while getting payments: ${mockError.message}`
      );
    });
  });

  describe('getUserPaymentById', () => {
    it('returns the expected payment when the repository returns a payment', async () => {
      const mockPayment = { id: '1', price: 100 };
      // @ts-ignore
      userPaymentRepository.getUserPaymentById.mockResolvedValue(mockPayment);

      const payment = await userPaymentService.getUserPaymentById('1');

      expect(payment).toEqual(mockPayment);
    });

    it('throws application error when the payment is not found', async () => {
      // @ts-ignore
      userPaymentRepository.getUserPaymentById.mockResolvedValue(null);

      await expect(userPaymentService.getUserPaymentById('1')).rejects.toThrow(
        'Error while getting payment details: Payment not found'
      );
    });

    it('throws application error when getting payment details fails', async () => {
      const mockError = new ApplicationError(
        'Failed to get payment details',
        500
      );
      // @ts-ignore
      userPaymentRepository.getUserPaymentById.mockRejectedValue(mockError);

      await expect(userPaymentService.getUserPaymentById('1')).rejects.toThrow(
        `Error while getting payment details: ${mockError.message}`
      );
    });
  });

  describe('getPaymentsHistory', () => {
    it('returns the expected payments history when the repository returns payments history', async () => {
      const mockPaymentsHistory = [
        { id: '1', userId: '1', price: 100 },
        { id: '2', userId: '1', price: 200 }
      ];
      userPaymentRepository.getPaymentsHistory.mockResolvedValue(
        // @ts-ignore
        mockPaymentsHistory
      );

      const paymentsHistory = await userPaymentService.getPaymentsHistory('1');

      expect(paymentsHistory).toEqual(mockPaymentsHistory);
    });

    it('throws application error when getting payments history fails', async () => {
      const mockError = new ApplicationError(
        'Failed to get payments history',
        500
      );
      // @ts-ignore
      userPaymentRepository.getPaymentsHistory.mockRejectedValue(mockError);

      await expect(userPaymentService.getPaymentsHistory('1')).rejects.toThrow(
        `Error while getting payments History: ${mockError.message}`
      );
    });
  });

  describe('payCourse', () => {
    it('throws application error when user is already enrolled in the course', async () => {
      const mockUserCourse = { userId: '1', courseId: 'course1' };
      userCourseRepository.getUserCourseByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        mockUserCourse
      );

      await expect(
        userPaymentService.payCourse('course1', '1')
      ).rejects.toThrow(
        'Error while creating payment: User is already enrolled in this course'
      );
    });

    it('returns existing payment when there is a pending payment', async () => {
      userCourseRepository.getUserCourseByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        null
      );
      const mockPayment = { userId: '1', courseId: 'course1', amount: 100 };
      userPaymentRepository.getPendingPaymentByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        mockPayment
      );

      const payment = await userPaymentService.payCourse('course1', '1');

      // @ts-ignore
      expect(payment.newPayment).toEqual(false);
    });

    it('creates a new payment when there is no pending payment', async () => {
      userCourseRepository.getUserCourseByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        null
      );
      const mockPayment = { userId: '1', courseId: 'course1', amount: 100 };
      userPaymentRepository.getPendingPaymentByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        null
      );
      // @ts-ignore
      userPaymentRepository.payCourse.mockResolvedValue(mockPayment);

      const payment = await userPaymentService.payCourse('course1', '1');

      // @ts-ignore
      expect(payment.newPayment).toEqual(true);
    });

    it('throws application error when creating payment fails', async () => {
      const mockError = new ApplicationError('Failed to create payment', 500);
      // @ts-ignore
      userPaymentRepository.payCourse.mockRejectedValue(mockError);

      await expect(
        userPaymentService.payCourse('course1', '1')
      ).rejects.toThrow(`Error while creating payment: ${mockError.message}`);
    });
  });

  describe('updatePayCourse', () => {
    it('throws application error when payment method is null', async () => {
      const userId = uuidv4();
      const existingUserPayment = { course_id: 'course1' };

      await expect(
        userPaymentService.updatePayCourse(
          existingUserPayment,
          null,
          'payment1',
          userId
        )
      ).rejects.toThrow('Payment method cannot be null');
    });

    it('updates the payment, creates a user course, and sends a notification when the payment method is not null', async () => {
      const existingUserPayment = {
        course_id: 'course1',
        course: { name: 'Course 1' }
      };
      const mockCourseMaterials = [uuidv4(), uuidv4()];
      const mockUpdatedPayment = {
        ...existingUserPayment,
        status: 'COMPLETED'
      };

      courseMaterialRepository.getCourseMaterialByCourseId.mockResolvedValue(
        // @ts-ignore
        mockCourseMaterials
      );
      // @ts-ignore
      userPaymentRepository.updatePayCourse.mockResolvedValue([
        [],
        [mockUpdatedPayment]
      ]);

      sequelize.transaction = jest.fn(async (callback) => {
        // @ts-ignore
        return await callback();
      });

      userNotificationService.createUserNotification.mockImplementation(() =>
        Promise.resolve()
      );

      const payment = await userPaymentService.updatePayCourse(
        existingUserPayment,
        'method1',
        'payment1',
        'user1'
      );

      expect(payment).toEqual(mockUpdatedPayment);
    });

    it('throws application error when updating payment fails', async () => {
      const mockCourseMaterials = [uuidv4(), uuidv4()];
      courseMaterialRepository.getCourseMaterialByCourseId.mockResolvedValue(
        // @ts-ignore
        mockCourseMaterials
      );
      courseMaterialStatusRepository.setCourseMaterialStatus.mockImplementation(
        () => Promise.resolve()
      );
      const mockError = new ApplicationError('Failed to update payment', 500);
      // @ts-ignore
      userPaymentRepository.updatePayCourse.mockRejectedValue(mockError);

      await expect(
        userPaymentService.updatePayCourse({}, 'method1', 'payment1', 'user1')
      ).rejects.toThrow(`Error while updating payment: ${mockError.message}`);
    });
  });

  describe('paymentFreePass', () => {
    it('throws application error when user is already enrolled in the course', async () => {
      const mockUserCourse = { userId: 'user1', courseId: 'course1' };
      userCourseRepository.getUserCourseByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        mockUserCourse
      );

      await expect(
        userPaymentService.paymentFreePass({ id: 'course1' }, 'user1')
      ).rejects.toThrow(
        'Error while enrolling course: User is already enrolled in this course'
      );
    });

    it('enrolls the user in the course and sends a notification when the user is not already enrolled', async () => {
      const mockCourseMaterials = ['material1', 'material2'];
      const mockCourse = { id: 'course1', name: 'Course 1' };

      userCourseRepository.getUserCourseByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        null
      );
      courseMaterialRepository.getCourseMaterialByCourseId.mockResolvedValue(
        // @ts-ignore
        mockCourseMaterials
      );

      sequelize.transaction = jest.fn(async (callback) => {
        const mockTransaction = {}; // or whatever mock transaction you want to use
        // @ts-ignore
        return await callback(mockTransaction);
      });

      // Mock the createUserNotification function
      userNotificationService.createUserNotification.mockImplementation(() =>
        Promise.resolve()
      );

      await userPaymentService.paymentFreePass(mockCourse, 'user1');

      // Check that the createUserCourse function was called with the correct arguments
      expect(userCourseRepository.createUserCourse).toHaveBeenCalledWith(
        { user_id: 'user1', course_id: 'course1' },
        expect.anything()
      );

      // Check that the createUserNotification function was called with the correct arguments
      expect(
        userNotificationService.createUserNotification
      ).toHaveBeenCalledWith('user1', {
        name: 'Kelas',
        description: 'Kamu berhasil masuk di kelas Course 1'
      });
    });

    it('throws application error when enrolling in the course fails', async () => {
      const mockError = new ApplicationError('Failed to enroll in course', 500);
      // @ts-ignore
      userCourseRepository.createUserCourse.mockRejectedValue(mockError);

      await expect(
        userPaymentService.paymentFreePass({ id: 'course1' }, 'user1')
      ).rejects.toThrow(`Error while enrolling course: ${mockError.message}`);
    });
  });
});
