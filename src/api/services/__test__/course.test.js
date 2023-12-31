import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../../repositories/course.js'), jest.Mock>} CourseRepositoryMock */
/**
 * @typedef {Record<
 *   keyof import('../../repositories/user-course.js'),
 *   jest.Mock
 * >} UserCourseRepositoryMock
 */
/** @typedef {Record<keyof import('../course.js'), jest.Mock>} CourseServiceMock */

jest.unstable_mockModule(
  '../../repositories/course.js',
  () =>
    /** @type {CourseRepositoryMock} */
    ({
      getCourses: jest.fn(),
      getUserCourses: jest.fn(),
      getUserCoursesWithFilter: jest.fn(),
      getNonVideoCourseById: jest.fn(),
      getCourseWithUserStatus: jest.fn(),
      getCourseById: jest.fn(),
      createCourse: jest.fn(),
      updateCourse: jest.fn(),
      destroyCourse: jest.fn()
    })
);

jest.unstable_mockModule(
  '../../repositories/user-course.js',
  () =>
    /** @type {UserCourseRepositoryMock} */
    ({
      getUserCourseByUserIdAndCourseId: jest.fn()
    })
);

const userCourseRepository = /** @type {UserCourseRepositoryMock} */ (
  await import('../../repositories/user-course.js')
);

const courseRepository = /** @type {CourseRepositoryMock} */ (
  await import('../../repositories/course.js')
);

const courseService = /** @type {CourseServiceMock} */ (
  await import('../course.js')
);

describe('Courses service', () => {
  describe('Get Courses', () => {
    it('returns course data', async () => {
      const mockCourses = [
        {
          id: '1',
          name: 'Emilia'
        }
      ];

      courseRepository.getCourses.mockResolvedValue(
        /** @ts-ignore */
        mockCourses
      );

      const courses = await courseService.getCourses({});

      expect(courses).toEqual(mockCourses);
    });

    it('throws application error when getting courses fails', async () => {
      const mockError = new ApplicationError('Failed to get courses', 500);

      courseRepository.getCourses.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(courseService.getCourses({})).rejects.toThrow(
        `Error while getting courses: ${mockError.message}`
      );
    });
  });

  describe('getUserCourses', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('returns user courses without filters', async () => {
      const mockCourses = [{ id: '1', name: 'Course 1' }];
      // @ts-ignore
      courseRepository.getUserCourses.mockResolvedValue(mockCourses);

      const result = await courseService.getUserCourses('1', {});
      expect(result).toEqual(mockCourses);
      expect(courseRepository.getUserCourses).toHaveBeenCalledWith('1');
    });

    it('throws an error when getting courses fails', async () => {
      const mockError = new ApplicationError('Failed to get courses', 500);

      // @ts-ignore
      courseRepository.getUserCourses.mockRejectedValue(mockError);

      await expect(courseService.getUserCourses('1', {})).rejects.toThrow(
        `Error while getting courses: ${mockError.message}`
      );
    });
  });

  describe('getCourseById', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('returns course for a user who has bought the course', async () => {
      const mockCourse = { id: '1', name: 'Course 1' };
      userCourseRepository.getUserCourseByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        mockCourse
      );
      // @ts-ignore
      courseRepository.getCourseWithUserStatus.mockResolvedValue(mockCourse);

      const result = await courseService.getCourseById('1', '1');
      expect(result).toEqual(mockCourse);
      expect(
        userCourseRepository.getUserCourseByUserIdAndCourseId
      ).toHaveBeenCalledWith('1', '1');
      expect(courseRepository.getCourseWithUserStatus).toHaveBeenCalledWith(
        '1',
        '1'
      );
    });

    it('returns course for a user who has not bought the course', async () => {
      const mockCourse = {
        id: '1',
        name: 'Course 1',
        dataValues: { course_chapter: [] }
      };
      userCourseRepository.getUserCourseByUserIdAndCourseId.mockResolvedValue(
        // @ts-ignore
        null
      );
      // @ts-ignore
      courseRepository.getCourseById.mockResolvedValue(mockCourse);

      const result = await courseService.getCourseById('1', '1');
      expect(result).toEqual(mockCourse);
      expect(
        userCourseRepository.getUserCourseByUserIdAndCourseId
      ).toHaveBeenCalledWith('1', '1');
      expect(courseRepository.getCourseById).toHaveBeenCalledWith('1');
    });

    it('returns course for a user who is not logged in', async () => {
      const mockCourse = { id: '1', name: 'Course 1' };
      // @ts-ignore
      courseRepository.getNonVideoCourseById.mockResolvedValue(mockCourse);

      const result = await courseService.getCourseById('1');
      expect(result).toEqual(mockCourse);
      expect(courseRepository.getNonVideoCourseById).toHaveBeenCalledWith('1');
    });

    it('throws an error when getting course details fails', async () => {
      const mockError = new ApplicationError(
        'Failed to get courses details',
        500
      );

      courseRepository.getNonVideoCourseById.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(courseService.getCourseById('1')).rejects.toThrow(
        `Error while getting course details: ${mockError.message}`
      );
    });
  });

  describe('createCourse', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('creates a course successfully', async () => {
      const mockPayload = {
        id: '1',
        name: 'Course 1',
        target_audience: '["audience1", "audience2"]',
        course_chapter: '["chapter1", "chapter2"]',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };
      const mockUserId = '1';
      const mockCourse = { id: '1', name: 'Course 1' };
      // @ts-ignore
      courseRepository.createCourse.mockResolvedValue(mockCourse);

      const result = await courseService.createCourse(mockPayload, mockUserId);
      expect(result).toEqual(mockCourse);
      expect(courseRepository.createCourse).toHaveBeenCalledWith({
        name: 'Course 1',
        user_id: '1',
        target_audience: ['audience1', 'audience2'],
        course_chapter: ['chapter1', 'chapter2']
      });
    });

    it('throws an error when creating a course fails', async () => {
      const mockPayload = {
        id: '1',
        name: 'Course 1',
        target_audience: '["audience1", "audience2"]',
        course_chapter: '["chapter1", "chapter2"]',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };
      const mockUserId = '1';
      const mockError = new ApplicationError('Failed to create course', 500);
      // @ts-ignore
      courseRepository.createCourse.mockRejectedValue(mockError);

      await expect(
        courseService.createCourse(mockPayload, mockUserId)
      ).rejects.toThrow(`Error while creating course: ${mockError.message}`);
    });
  });

  describe.skip('Update course', () => {
    it('returns updated course data with that user id updates it', async () => {
      const mockCourse = {
        id: '1',
        name: 'Emilia'
      };

      courseRepository.updateCourse.mockResolvedValue(
        /** @ts-ignore */
        [null, [mockCourse]]
      );

      const course = await courseService.updateCourse('1', mockCourse);

      expect(course).toEqual(mockCourse);
    });

    it('throws application error when updating course fails', async () => {
      const mockError = new ApplicationError('Failed to update course', 500);

      courseRepository.updateCourse.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(courseService.updateCourse('1', {}, '1')).rejects.toThrow(
        `Error while updating course: ${mockError.message}`
      );
    });
  });

  describe('Destroy course', () => {
    it('throws application error when destroying course fails', async () => {
      const mockError = new ApplicationError('Failed to destroy course', 500);

      courseRepository.destroyCourse.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(courseService.destroyCourse('1')).rejects.toThrow(
        `Error while deleting course: ${mockError.message}`
      );
    });
  });
});
