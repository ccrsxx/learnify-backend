import { faker } from '@faker-js/faker';
import * as UserModel from '../api/models/user.js';

/**
 * Generate 100 dummy users.
 *
 * @returns {Omit<UserModel.UserAttributes, 'id'>[]}
 */
export function generateRandomUser() {
  return Array.from({ length: 100 }, () => ({
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(UserModel.userRoles),
    image: faker.image.avatar(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }));
}
