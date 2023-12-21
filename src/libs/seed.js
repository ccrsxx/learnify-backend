import {
  User,
  Course,
  CourseChapter,
  CourseCategory
} from '../api/models/index.js';
import * as userPaymentService from '../api/services/user-payment.js';
import { faker } from '@faker-js/faker';

export function generateRandomUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    admin: faker.datatype.boolean(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    phone_number: faker.helpers.replaceSymbolWithNumber('+628##########')
  };
}

export function generateRandomCourseCategory() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.product(),
    image: faker.image.urlLoremFlickr({ category: 'animals' }),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent()
  };
}

export function generateRandomCourse() {
  return {
    name: faker.commerce.product(),
    code: faker.string.alpha(8),
    price: faker.number.int({ min: 10_000, max: 1_000_000 }),
    author: faker.person.fullName(),
    image: faker.image.urlLoremFlickr({ category: 'animals' }),
    rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
    premium: faker.datatype.boolean(),
    telegram: faker.internet.url(),
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
    onboarding_text: faker.commerce.productDescription(),
    user_id: faker.string.uuid(),
    course_category_id: faker.string.uuid(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent()
  };
}

export function generateRandomCourseChapter() {
  return {
    duration: faker.number.int({ min: 10, max: 60 }),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent()
  };
}

export function generateRandomCourseMaterial() {
  return {
    video: faker.internet.url(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent()
  };
}

/**
 * @param {string} tableName
 * @param {import('sequelize').QueryInterface} queryInterface
 */
export async function isTableHasRecords(tableName, queryInterface) {
  return (
    queryInterface
      // @ts-ignore
      .select(null, tableName, { limit: 1 })
      .then((data) => data.length === 1)
  );
}

/** @param {string} courseId */
export async function backfillUserCourse(courseId) {
  const userId = /** @type {string} */ (await getNormalUserId());

  const payment = await userPaymentService.payCourse(courseId, userId);

  const course = await Course.findByPk(courseId);

  const existingPayment = { ...payment, course };

  await userPaymentService.updatePayCourse(
    existingPayment,
    'CREDIT_CARD',
    payment.id,
    userId
  );
}

/** @param {string} name */
export async function getCategoryIdByName(name) {
  return CourseCategory.findOne({
    where: { name }
  }).then((model) => model?.dataValues.id);
}

/** @param {string} name */
export async function getCourseIdByName(name) {
  return Course.findOne({
    where: { name }
  }).then((model) => model?.dataValues.id);
}

/** @param {string} name */
export async function getCourseChapterIdByName(name) {
  return CourseChapter.findOne({
    where: { name }
  }).then((model) => model?.dataValues.id);
}

export async function getAdminUserId() {
  return User.findOne({
    where: { admin: true, email: 'emilia@rezero.com' }
  }).then((model) => model?.dataValues.id);
}

export async function getNormalUserId() {
  return User.findOne({
    where: { admin: false, email: 'rem@rezero.com' }
  }).then((model) => model?.dataValues.id);
}
