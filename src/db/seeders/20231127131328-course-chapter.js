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
        name: 'Pengenalan Design System',
        order_index: 1,
        course_id: await getCourseIdByName('Intro to Design System'),
        duration: 30
      },
      {
        id: '8c6123f2-79f9-4e4b-9f51-1b1a3e949b09',
        name: 'Workflow Membangun Design System',
        order_index: 2,
        course_id: await getCourseIdByName('Intro to Design System'),
        duration: 80
      },
      {
        id: '3062d67c-e17a-46e5-9bcb-8c31045d8a74',
        name: 'Memahami Product Management',
        order_index: 1,
        course_id: await getCourseIdByName('Product Management Fundamentals'),
        duration: 60
      },
      {
        id: '9580ab8b-bd69-4958-87ee-41fa51722ee0',
        name: 'Value Management',
        order_index: 2,
        course_id: await getCourseIdByName('Product Management Fundamentals'),
        duration: 120
      },
      {
        id: '7a5d822a-c78c-458b-9b1d-8c2ffa94bdfa',
        name: 'Penjelasan Arsitektur',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Web Development Microservice: Website Kelas Online'
        ),
        duration: 45
      },
      {
        id: '8fe138d5-6d31-4fbb-a3d9-92fc6cc29902',
        name: 'Service Media & Service User',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Web Development Microservice: Website Kelas Online'
        ),
        duration: 90
      },
      {
        id: '3fbd0e34-76d0-4bdc-be25-0f5b7d6ce0a7',
        name: 'Dasar Website',
        order_index: 1,
        course_id: await getCourseIdByName('Full-Stack Web Developer'),
        duration: 30
      },
      {
        id: 'faecee5c-ab65-4f16-82e9-1e6406925c8d',
        name: 'Pengembangan Website',
        order_index: 2,
        course_id: await getCourseIdByName('Full-Stack Web Developer'),
        duration: 80
      },
      {
        id: '318a1ec8-f3bd-4d8d-887a-18f7532389ac',
        name: 'Hal Dasar',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Flutter Developer: Provider State Management'
        ),
        duration: 60
      },
      {
        id: '83bd67d1-aea6-406e-95ea-b398851dc891',
        name: 'Studi Kasus',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Flutter Developer: Provider State Management'
        ),
        duration: 120
      },
      {
        id: 'b9752474-43d1-4dcb-9cd2-fc39d745882e',
        name: 'Pengenalan UI Design',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Learn Flutter & Adobe XD: Build a Complete Mobile App'
        ),
        duration: 45
      },
      {
        id: 'd87dc998-6b43-4369-a2fa-5a203820472f',
        name: 'Tahap UI Design',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Learn Flutter & Adobe XD: Build a Complete Mobile App'
        ),
        duration: 90
      },
      {
        id: '3f2e8391-448a-4053-8b14-195218adedbe',
        name: 'Pengenalan XCode',
        order_index: 1,
        course_id: await getCourseIdByName(
          'SwiftUI & iOS Engineer: The Complete App Development Bootcamp'
        ),
        duration: 30
      },
      {
        id: '71957e76-c53d-4c6a-aa1b-4a4859cfc889',
        name: 'Memulai Koding',
        order_index: 2,
        course_id: await getCourseIdByName(
          'SwiftUI & iOS Engineer: The Complete App Development Bootcamp'
        ),
        duration: 80
      },
      {
        id: '30c202ea-da0c-4c03-9393-6b50f8bfa678',
        name: 'Pengenalan SQL',
        order_index: 1,
        course_id: await getCourseIdByName(
          'SQL for Beginners: Learn SQL using MySQL and Database Design'
        ),
        duration: 60
      },
      {
        id: '29bcebf0-02e9-4e38-b2f8-ba32010589f3',
        name: 'Dasar SQL',
        order_index: 2,
        course_id: await getCourseIdByName(
          'SQL for Beginners: Learn SQL using MySQL and Database Design'
        ),
        duration: 120
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
