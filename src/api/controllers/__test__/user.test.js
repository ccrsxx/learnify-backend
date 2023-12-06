import { jest } from '@jest/globals';
// import { ApplicationError } from '../../../libs/error.js';
import * as userController from '../user.js';
/** @typedef {Record<keyof import('../../services/user.js'), jest.Mock>} UserServiceMock */

jest.unstable_mockModule(
  '../../services/user.js',
  () =>
    /** @type {UserServiceMock} */
    ({
      updateUser: jest.fn()
    })
);

// const userService = /** @type {UserServiceMock} */ (
//   await import('../../services/user.js')
// );

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
      userController.getCurrentUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockUser });
    });
  });

  // HELP DEBUG OAWKOAWKO
  // describe('Update user', () => {
  //   it('should return 200 status code with updated user data', async () => {
  //     const mockUser = {
  //       id: ,
  //       name: 'Emilia'
  //     };
  //     userService.updateUser.mockResolvedValue(
  //       // @ts-ignore
  //       mockUser
  //     );
  //     const mockRequest = { body: mockUser };
  //     const mockResponse = {
  //       locals: { user: { id: '1' } },
  //       json: jest.fn(),
  //       status: jest.fn().mockReturnThis()
  //     };

  //     // const updatedUser = { id: '1', name: 'New Name' };
  //     await userController.updateUser(mockRequest, mockResponse);

  //     expect(mockResponse.status).toHaveBeenCalledWith(200);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'User profile updated successfully',
  //       data: mockUser
  //     });
  //   });

  //   it('should return 500 status code when update fails', async () => {
  //     const mockRequest = { body: { name: 'New Name' } };
  //     const mockResponse = {
  //       locals: { user: { id: '1' } },
  //       json: jest.fn(),
  //       status: jest.fn().mockReturnThis()
  //     };

  //     const mockError = new ApplicationError('Error while updating user', 500);

  //     userService.updateUser.mockRejectedValue(
  //       // @ts-ignore
  //       mockError
  //     );

  //     await userController.updateUser(mockRequest, mockResponse);

  //     expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: mockError.message
  //     });
  //   });
  // });
});
