import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import { faker } from '@faker-js/faker';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/courses', router);

  router.get('/', (_req, res) => {
    res.status(200).json({
      data: generateRandomCourse()
    });
  });
};

export function generateRandomCourse() {
  return Array.from({ length: 1 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    price: faker.commerce.price(),
    details: {
      about: faker.commerce.productDescription(),
      target: Array.from({ length: 3 }, () =>
        faker.commerce.productDescription()
      )
    },
    premium: faker.datatype.boolean(),
    onboarding: faker.commerce.productDescription(),
    difficulty: faker.helpers.arrayElement([
      'BEGINNER',
      'INTERMEDIATE',
      'ADVANCED'
    ]),
    telegram_link: faker.internet.url(),
    intro_video_link: faker.internet.url(),
    course_category_id: faker.string.uuid(),
    category: {
      id: faker.string.uuid(),
      name: faker.commerce.product(),
      image: faker.image.urlLoremFlickr({ category: 'animals' }),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent()
    },
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  }));
}
