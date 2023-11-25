import { faker } from '@faker-js/faker';

export function generateRandomUser() {
  return {
    name: faker.person.fullName(),
    admin: faker.datatype.boolean(),
    email: faker.internet.email(),
    phone_number: faker.helpers.replaceSymbolWithNumber('+628##########'),
    password: faker.internet.password(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent()
  };
}

export function generateRandomCategory() {
  return {
    name: faker.commerce.product(),
    image: faker.image.urlLoremFlickr({ category: 'animals' }),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent()
  };
}

export function generateCategory() {
  const categories = [
    {
      name: 'UI/UX Design',
      image:
        'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/znwzjnbzevzldg88voxx'
    },
    {
      name: 'Product Management',
      image:
        'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/yr8lgaxnv9yr8mifvfqz'
    },
    {
      name: 'Web Development',
      image:
        'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/zuhljmfokfjfynnv5vs3'
    },
    {
      name: 'Android Development',
      image:
        'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/po9zcr17lovq6ezrh0ot'
    },
    {
      name: 'IOS Development',
      image:
        'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/fcaf00ejsgcqtylujckl'
    },
    {
      name: 'Data Science',
      image:
        'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/zuhljmfokfjfynnv5vs3'
    }
  ];

  const data = [];

  for (let i = 0; i < categories.length; i++) {
    data.push({
      name: categories[i].name,
      image: categories[i].image,
      created_at: faker.date.recent(),
      updated_at: faker.date.recent()
    });
  }

  return data;
}

export function generateRandomCourse() {
  return {
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
    created_at: faker.date.recent(),
    updated_at: faker.date.recent()
  };
}
