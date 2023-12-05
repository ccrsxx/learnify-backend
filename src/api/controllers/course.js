import * as courseService from '../services/course.js';
import * as Types from '../../libs/types/common.js';
import { ApplicationError } from '../../libs/error.js';
import { uploadCloudinary } from '../middlewares/upload.js';

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function getCourses(req, res) {
  try {
    const params = req.query;

    const data = await courseService.getCourses(params);

    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const data = await courseService.getCourseById(id);

    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.AuthorizedController<typeof uploadCloudinary>}
 * @returns {Promise<void>}
 */
export async function createCourse(req, res) {
  const { body } = req;

  const { id: userId } = res.locals.user;

  const image = res.locals.image ?? 'default image update later';

  try {
    const bodyWithImage = { ...body, image: image };

    const course = await courseService.createCourse(bodyWithImage, userId);

    res
      .status(201)
      .json({ message: 'Course created successfully', data: course });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.AuthorizedController}
 * @returns {Promise<void>}
 */
export async function updateCourse(req, res) {
  const { body } = req;
  const { id } = req.params;
  const oldCourseData = await courseService.getCourseById(id);

  // @ts-ignore
  const image = res.locals.image ?? oldCourseData.image;
  const bodyWithImage = { ...body, image: image };

  try {
    const course = await courseService.updateCourse(id, bodyWithImage);

    res
      .status(200)
      .json({ message: 'Course updated successfully', data: course });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.AuthorizedController}
 * @returns {Promise<void>}
 */
export async function destroyCourse(req, res) {
  const { id } = req.params;

  try {
    await courseService.destroyCourse(id);

    res
      .status(204)
      .json({ message: 'Course deleted successfully', data: null });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
