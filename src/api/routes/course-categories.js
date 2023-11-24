import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import { faker } from '@faker-js/faker';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/course-categories', router);

  router.get('/', (_req, res) => {
    res.status(200).json({
      data: Array.from({ length: 10 }, generateRandomCategory)
    });
  });
};

export function generateRandomCategory() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.product(),
    image: faker.image.urlLoremFlickr({ category: 'animals' }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  };
}
