/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const {
      isTableHasRecords,
      getCourseIdByName,
      generateRandomCourseChapter
    } = await import('../../libs/seed.js');

    if (await isTableHasRecords('course_chapter', queryInterface)) return;

    const courseChapters = [
      {
        id: 'f98eec9a-7b39-49b5-b213-6d9789a54208',
        name: 'Pengenalan Figma',
        order_index: 1,
        course_id: await getCourseIdByName('Belajar Figma')
      },
      {
        id: '8c6123f2-79f9-4e4b-9f51-1b1a3e949b09',
        name: 'Design Sederhana Dengan Figma',
        order_index: 2,
        course_id: await getCourseIdByName('Belajar Figma')
      },
      {
        id: '90a8d696-7380-488d-bb39-fc3ec3e11c2d',
        name: 'Pengenalan Frontend',
        order_index: 1,
        course_id: await getCourseIdByName('Belajar Frontend developer')
      },
      {
        id: '4f372e6b-9f5b-4ce8-bc71-16cb75948d34',
        name: 'Pengenalan HTML & CSS',
        order_index: 2,
        course_id: await getCourseIdByName('Belajar Frontend developer')
      },
      {
        id: '3062d67c-e17a-46e5-9bcb-8c31045d8a74',
        name: 'Pengenalan Fullstack',
        order_index: 1,
        course_id: await getCourseIdByName('Belajar Fullstack developer')
      },
      {
        id: '9580ab8b-bd69-4958-87ee-41fa51722ee0',
        name: 'Fundamental Programming',
        order_index: 2,
        course_id: await getCourseIdByName('Belajar Fullstack developer')
      },
      {
        id: 'aeffb321-3b60-44de-8b4c-d383938ba840',
        name: 'Pengenalan React Native',
        order_index: 1,
        course_id: await getCourseIdByName('Belajar React Native')
      },
      {
        id: 'c2bf0f5e-8797-4527-92a5-52eb644f11cd',
        name: 'Pengenalan Component',
        order_index: 2,
        course_id: await getCourseIdByName('Belajar React Native')
      },
      {
        id: '497f8c2b-c0fa-4ee0-b342-c07c9bfdb17e',
        name: 'Pengenalan Flutter',
        order_index: 1,
        course_id: await getCourseIdByName('Belajar Flutter')
      },
      {
        id: 'de40b4db-1193-423b-8797-05fc953be75e',
        name: 'Instalasi Flutter',
        order_index: 2,
        course_id: await getCourseIdByName('Belajar Flutter')
      },
      {
        id: '7a5d822a-c78c-458b-9b1d-8c2ffa94bdfa',
        name: 'Pengenalan Swift',
        order_index: 1,
        course_id: await getCourseIdByName('Belajar Swift')
      },
      {
        id: '8fe138d5-6d31-4fbb-a3d9-92fc6cc29902',
        name: 'Memulai dengan Swift',
        order_index: 2,
        course_id: await getCourseIdByName('Belajar Swift')
      }
    ];

    const seedCourseChapters = courseChapters.map((chapter) => ({
      ...generateRandomCourseChapter(),
      ...chapter
    }));

    return queryInterface.bulkInsert('course_chapter', seedCourseChapters);
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('course_chapter', null, {});
  }
};
