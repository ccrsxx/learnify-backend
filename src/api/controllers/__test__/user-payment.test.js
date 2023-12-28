import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../user-payment.js'), jest.Mock>} UserPaymentControllerMock */
/**
 * @typedef {Record<
 *   keyof import('../../services/user-payment.js'),
 *   jest.Mock
 * >} UserPaymentServiceMock
 */

jest.unstable_mockModule(
  '../../services/user-payment.js',
  () =>
    /** @type {UserPaymentServiceMock} */
    ({
      getPayments: jest.fn(),
      getUserPaymentById: jest.fn(),
      getPaymentsHistory: jest.fn(),
      payCourse: jest.fn(),
      updatePayCourse: jest.fn(),
      paymentFreePass: jest.fn()
    })
);

const userPaymentController = /** @type {UserPaymentControllerMock} */ (
  await import('../user-payment.js')
);

const userPaymentService = /** @type {UserPaymentServiceMock} */ (
  await import('../../services/user-payment.js')
);

describe('User Payment Controller', () => {
  describe('getPayments', () => {
    it('should return payments', async () => {
      const mockPayments = [{ id: 1, amount: 100 }];
      // @ts-ignore
      userPaymentService.getPayments.mockResolvedValue(mockPayments);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.getPayments(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockPayments });
    });

    it('throws application error when getPayments fails', async () => {
      const mockError = new ApplicationError('Failed to get payments', 500);
      // @ts-ignore
      userPaymentService.getPayments.mockRejectedValue(mockError);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.getPayments(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when getPayments fails', async () => {
      const mockError = new Error();
      // @ts-ignore
      userPaymentService.getPayments.mockRejectedValue(mockError);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.getPayments(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('getPaymentById', () => {
    it('should return payment by id', async () => {
      const mockPayment = { id: 1, amount: 100 };
      const mockRequest = { params: { id: 1 } };

      // @ts-ignore
      userPaymentService.getUserPaymentById.mockResolvedValue(mockPayment);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.getPaymentById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockPayment });
    });

    it('throws application error when getPaymentById fails', async () => {
      const mockError = new ApplicationError('Failed to get payment', 500);
      const mockRequest = { params: { id: 1 } };

      // @ts-ignore
      userPaymentService.getUserPaymentById.mockRejectedValue(mockError);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.getPaymentById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when getPaymentById fails', async () => {
      const mockError = new Error();
      const mockRequest = { params: { id: 1 } };

      // @ts-ignore
      userPaymentService.getUserPaymentById.mockRejectedValue(mockError);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.getPaymentById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('getPaymentsHistory', () => {
    it('should return payments history', async () => {
      const mockPaymentsHistory = [{ id: 1, amount: 100, date: '2023-01-01' }];
      const mockUser = { id: 1 };
      const mockResponse = {
        locals: { user: mockUser },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      userPaymentService.getPaymentsHistory.mockResolvedValue(
        // @ts-ignore
        mockPaymentsHistory
      );

      await userPaymentController.getPaymentsHistory(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockPaymentsHistory
      });
    });

    it('throws application error when getPaymentsHistory fails', async () => {
      const mockError = new ApplicationError(
        'Failed to get payments history',
        500
      );
      const mockUser = { id: 1 };
      const mockResponse = {
        locals: { user: mockUser },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      userPaymentService.getPaymentsHistory.mockRejectedValue(mockError);

      await userPaymentController.getPaymentsHistory(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when getPaymentsHistory fails', async () => {
      const mockError = new Error();
      const mockUser = { id: 1 };
      const mockResponse = {
        locals: { user: mockUser },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      userPaymentService.getPaymentsHistory.mockRejectedValue(mockError);

      await userPaymentController.getPaymentsHistory(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('payCourse', () => {
    it('should create a new payment', async () => {
      const mockPayment = { id: 1, amount: 100, date: '2023-01-01' };
      const mockUser = { id: 1 };
      const mockRequest = {
        body: { course_id: 1 }
      };

      // @ts-ignore
      userPaymentService.payCourse.mockResolvedValue({
        newPayment: true,
        ...mockPayment
      });

      const mockResponse = {
        locals: { user: mockUser },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      await userPaymentController.payCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Payment created successfully',
        data: mockPayment
      });
    });

    it('should return existing payment', async () => {
      const mockPayment = { id: 1, amount: 100, date: '2023-01-01' };
      const mockUser = { id: 1 };
      const mockRequest = {
        body: { course_id: 1 }
      };

      // @ts-ignore
      userPaymentService.payCourse.mockResolvedValue({
        newPayment: false,
        ...mockPayment
      });

      const mockResponse = {
        locals: { user: mockUser },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.payCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Payment already exists and not expired yet',
        data: mockPayment
      });
    });

    it('throws application error when payCourse fails', async () => {
      const mockError = new ApplicationError('Failed to pay course', 500);
      const mockUser = { id: 1 };
      const mockRequest = {
        body: { course_id: 1 }
      };

      // @ts-ignore
      userPaymentService.payCourse.mockRejectedValue(mockError);

      const mockResponse = {
        locals: { user: mockUser },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.payCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when payCourse fails', async () => {
      const mockError = new Error();
      const mockUser = { id: 1 };
      const mockRequest = {
        body: { course_id: 1 }
      };

      // @ts-ignore
      userPaymentService.payCourse.mockRejectedValue(mockError);

      const mockResponse = {
        locals: { user: mockUser },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.payCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('updatePayCourse', () => {
    it('should update a payment', async () => {
      const mockPayment = { id: 1, amount: 100, date: '2023-01-01' };
      const mockRequest = {
        body: { payment_method: 'CREDIT_CARD' },
        params: { id: 1 }
      };

      // @ts-ignore
      userPaymentService.updatePayCourse.mockResolvedValue(mockPayment);

      const mockResponse = {
        locals: { user: { id: 1 }, payment: mockPayment },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.updatePayCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Payment successfully updated',
        data: mockPayment
      });
    });

    it('throws application error when updatePayCourse fails', async () => {
      const mockError = new ApplicationError('Failed to update payment', 500);
      const mockRequest = {
        body: { payment_method: 'CREDIT_CARD' },
        params: { id: 1 }
      };

      // @ts-ignore
      userPaymentService.updatePayCourse.mockRejectedValue(mockError);

      const mockResponse = {
        locals: {
          user: { id: 1 },
          payment: { id: 1, amount: 100, date: '2023-01-01' }
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.updatePayCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when updatePayCourse fails', async () => {
      const mockError = new Error();
      const mockRequest = {
        body: { payment_method: 'credit card' },
        params: { id: 1 },
        locals: {
          user: { id: 1 },
          payment: { id: 1, amount: 100, date: '2023-01-01' }
        }
      };

      // @ts-ignore
      userPaymentService.updatePayCourse.mockRejectedValue(mockError);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await userPaymentController.updatePayCourse(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('payFreeCourse', () => {
    it('should enroll a free course', async () => {
      const mockUser = { id: 1 };
      const mockCourse = { id: 1, title: 'Free Course' };
      const mockResponse = {
        locals: { user: mockUser, course: mockCourse },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      userPaymentService.paymentFreePass.mockResolvedValue();

      await userPaymentController.payFreeCourse(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Free course successfully enrolled'
      });
    });

    it('throws application error when payFreeCourse fails', async () => {
      const mockError = new ApplicationError(
        'Failed to enroll free course',
        500
      );
      const mockUser = { id: 1 };
      const mockCourse = { id: 1, title: 'Free Course' };
      const mockResponse = {
        locals: { user: mockUser, course: mockCourse },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      userPaymentService.paymentFreePass.mockRejectedValue(mockError);

      await userPaymentController.payFreeCourse(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockError.message
      });
    });

    it('throws generic error when payFreeCourse fails', async () => {
      const mockError = new Error();
      const mockUser = { id: 1 };
      const mockCourse = { id: 1, title: 'Free Course' };
      const mockResponse = {
        locals: { user: mockUser, course: mockCourse },
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // @ts-ignore
      userPaymentService.paymentFreePass.mockRejectedValue(mockError);

      await userPaymentController.payFreeCourse(null, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
