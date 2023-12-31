import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/**
 * @typedef {Record<
 *   keyof import('../../repositories/user-course.js'),
 *   jest.Mock
 * >} UserCourseRepositoryMock
 */
/** @typedef {Record<keyof import('../user-course.js'), jest.Mock>} UserCourseServiceMock */

jest.unstable_mockModule(
  '../../repositories/user-course.js',
  () =>
    /** @type {UserCourseRepositoryMock} */
    ({
      setOnboardedTrue: jest.fn()
    })
);

const userCourseRepository = /** @type {UserCourseRepositoryMock} */ (
  await import('../../repositories/user-course.js')
);

const userCourseService = /** @type {UserCourseServiceMock} */ (
  await import('../user-course.js')
);

describe('User course service', () => {
  it('should update onboarded status and return the updated user course', async () => {
    const userId = '123';
    const mockUserCourse = { id: '123', onboarded: true };

    // @ts-ignore
    userCourseRepository.setOnboardedTrue.mockResolvedValue([
      1,
      [mockUserCourse]
    ]);

    const updatedUserCourse = await userCourseService.setOnboardedTrue(userId);

    expect(updatedUserCourse).toEqual(mockUserCourse);
    expect(userCourseRepository.setOnboardedTrue).toHaveBeenCalledWith(userId);
  });

  it('should throw an ApplicationError when user course is not found', async () => {
    const userId = '123';

    // @ts-ignore
    userCourseRepository.setOnboardedTrue.mockResolvedValue([1, []]);

    await expect(userCourseService.setOnboardedTrue(userId)).rejects.toThrow(
      'User Course Not Found'
    );
  });

  it('should throw a generated ApplicationError when an unexpected error occurs', async () => {
    const userId = '123';
    const mockError = new ApplicationError(
      'Failed to update user courses',
      500
    );

    // @ts-ignore
    userCourseRepository.setOnboardedTrue.mockRejectedValue(mockError);

    await expect(userCourseService.setOnboardedTrue(userId)).rejects.toThrow(
      'Error while updating onboarded status'
    );
  });
});
