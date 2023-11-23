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
  return Array.from({ length: 25 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    code: faker.string.alpha(10),
    price: faker.commerce.price(),
    author: faker.person.firstName(),
    rating: 5,
    premium: faker.datatype.boolean(),
    telegram: faker.internet.url(),
    onboarding: faker.commerce.productDescription(),
    difficulty: faker.helpers.arrayElement([
      'BEGINNER',
      'INTERMEDIATE',
      'ADVANCED'
    ]),
    desciption: faker.commerce.productDescription(),
    intro_video: faker.internet.url(),
    target_audience: Array.from({ length: 3 }, () =>
      faker.commerce.productDescription()
    ),
    user_id: faker.string.uuid(),
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
