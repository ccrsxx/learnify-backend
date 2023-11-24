import { Router } from 'express';
import * as Types from '../../libs/types/common.js';
import { faker } from '@faker-js/faker';
import { generateRandomCategory } from './course-categories.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  const router = Router();

  app.use('/courses', router);

  router.get('/', (_req, res) => {
    res.status(200).json({
      data: Array.from({ length: 50 }, generateRandomCourse)
    });
  });
};

export function generateRandomCourse() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.product(),
    code: faker.string.alpha(8),
    price: faker.commerce.price(),
    author: faker.person.fullName(),
    rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
    premium: faker.datatype.boolean(),
    telegram: faker.internet.url(),
    onboarding: faker.commerce.productDescription(),
    difficulty: faker.helpers.arrayElement([
      'BEGINNER',
      'INTERMEDIATE',
      'ADVANCED'
    ]),
    description: faker.commerce.productDescription(),
    intro_video: faker.internet.url(),
    target_audience: Array.from({ length: 3 }, () =>
      faker.commerce.productDescription()
    ),
    user_id: faker.string.uuid(),
    course_category_id: faker.string.uuid(),
    user: {
      id: faker.string.uuid(),
      role: faker.helpers.arrayElement(['ADMIN', 'USER']),
      email: faker.internet.email(),
      phone_number: faker.helpers.replaceSymbolWithNumber('+628##########'),
      password: faker.internet.password(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent()
    },
    category: generateRandomCategory(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  };
}
