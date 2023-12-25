import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';

/** @typedef {Record<keyof import('../../repositories/course.js'), jest.Mock>} CourseRepositoryMock */
/** @typedef {Record<keyof import('../course.js'), jest.Mock>} CourseServiceMock */

jest.unstable_mockModule(
  '../../repositories/course.js',
  () =>
    /** @type {CourseRepositoryMock} */
    ({
      getCourses: jest.fn(),
      getCourseById: jest.fn(),
      createCourse: jest.fn(),
      updateCourse: jest.fn(),
      destroyCourse: jest.fn()
    })
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

  describe.skip('Get course', () => {
    it('returns course data', async () => {
      const mockCourse = {
        id: '1',
        name: 'Emilia'
      };

      courseRepository.getCourseById.mockResolvedValue(
        /** @ts-ignore */
        mockCourse
      );

      const course = await courseService.getCourseById('1');

      expect(course).toEqual(mockCourse);
    });

    it('throws application error when getting course details fails', async () => {
      const mockError = new ApplicationError('Failed to get course', 500);

      courseRepository.getCourseById.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(courseService.getCourseById('1')).rejects.toThrow(
        `Error while getting course details: ${mockError.message}`
      );
    });

    it('throws application error when course is not found', async () => {
      courseRepository.getCourseById.mockResolvedValue(
        /** @ts-ignore */
        null
      );

      await expect(courseService.getCourseById('1')).rejects.toThrow(
        'Error while getting course details: Course not found'
      );
    });

    it('throws application error when getting course fails', async () => {
      const mockError = new ApplicationError('Failed to get course', 500);

      courseRepository.getCourseById.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(courseService.getCourseById('1')).rejects.toThrow(
        `Error while getting course details: ${mockError.message}`
      );
    });
  });

  describe.skip('Create course', () => {
    it('returns created course data with the user id that creates', async () => {
      const userId = '1';

      const mockCourse = {
        id: '1',
        name: 'Emilia'
      };

      const mockCourseWithUserId = {
        ...mockCourse,
        userId
      };

      courseRepository.createCourse.mockResolvedValue(
        /** @ts-ignore */
        mockCourseWithUserId
      );

      const course = await courseService.createCourse(mockCourse, userId);

      expect(course).not.toEqual(mockCourse);
      expect(course).toEqual(mockCourseWithUserId);
    });

    it('throws application error when creating course fails', async () => {
      const mockError = new ApplicationError('Failed to create course', 500);

      courseRepository.createCourse.mockRejectedValue(
        /** @ts-ignore */
        mockError
      );

      await expect(courseService.createCourse({}, '1')).rejects.toThrow(
        `Error while creating course: ${mockError.message}`
      );
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
