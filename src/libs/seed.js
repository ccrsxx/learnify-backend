import { faker } from '@faker-js/faker';

export function generateRandomUser() {
  return {
    id: faker.string.uuid(),
    role: faker.helpers.arrayElement(['ADMIN', 'USER']),
    email: faker.internet.email(),
    phone_number: faker.helpers.replaceSymbolWithNumber('+628##########'),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  };
}

export function generateRandomCategory() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.product(),
    image: faker.image.urlLoremFlickr({ category: 'animals' }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  };
}

export function generateCategory() {
  const categories = [
    { name: 'UI/UX Design', image: '' },
    { name: 'Product Management', image: '' },
    { name: 'Web Development', image: '' },
    { name: 'Android Development', image: '' },
    { name: 'IOS Development', image: '' },
    { name: 'Data Science', image: '' }
  ];
  let data = [];
  for (let i = 0; i < categories.length; i++) {
    data.push({
      id: faker.string.uuid(),
      name: categories[i].name,
      image: faker.image.urlLoremFlickr({ category: 'animals' }),
      created_at: faker.date.recent(),
      updated_at: faker.date.recent()
    });
  }
  return data;
}

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
    user: generateRandomUser(),
    course_category: generateRandomCategory(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  };
}
