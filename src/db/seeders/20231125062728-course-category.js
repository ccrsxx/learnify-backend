/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const courseCategories = [
      {
        id: 'c63a172f-4eb1-44b2-8c90-66336b016d8f',
        name: 'UI/UX Design',
        image:
          'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/znwzjnbzevzldg88voxx'
      },
      {
        id: '5db0a017-6041-4d9a-8f44-5fca03d5378a',
        name: 'Product Management',
        image:
          'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/yr8lgaxnv9yr8mifvfqz'
      },
      {
        id: '0d7925a7-0c68-4c25-9c9a-c1f346bdc9fc',
        name: 'Web Development',
        image:
          'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/zuhljmfokfjfynnv5vs3'
      },
      {
        id: 'f3102f7e-9916-4ff8-a50c-60048f7b634c',
        name: 'Android Development',
        image:
          'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/po9zcr17lovq6ezrh0ot'
      },
      {
        id: 'c3964d15-6932-4dff-aaae-84bed19707b1',
        name: 'IOS Development',
        image:
          'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/fcaf00ejsgcqtylujckl'
      },
      {
        id: 'bfd0ab17-01f8-4572-bc78-347c635ecf38',
        name: 'Data Science',
        image:
          'https://res.cloudinary.com/damvxl4ky/image/upload/f_auto,q_auto/v1/binar_final/course_categories/zuhljmfokfjfynnv5vs3'
      }
    ];

    const { generateRandomCourseCategory } = await import('../../libs/seed.js');

    const seedCourseCategories = courseCategories.map((category) => ({
      ...generateRandomCourseCategory(),
      ...category
    }));

    return queryInterface.bulkInsert('course_category', seedCourseCategories);
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('course_category', null, {});
  }
};
