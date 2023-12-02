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
        course_id: await getCourseIdByName('Intro to Design System')
      },
      {
        id: '8c6123f2-79f9-4e4b-9f51-1b1a3e949b09',
        name: 'Workflow Membangun Design System',
        order_index: 2,
        course_id: await getCourseIdByName('Intro to Design System')
      },
      {
        id: '54eb1b28-d2c5-46a6-b86c-b5682e5084a7',
        name: 'Pengenalan UI/UX Design',
        order_index: 1,
        course_id: await getCourseIdByName(
          'UI/UX Design Website Design With Figma'
        )
      },
      {
        id: 'cc721087-ce99-4996-ac98-7c7b63c0244f',
        name: 'Pengenalan Figma',
        order_index: 2,
        course_id: await getCourseIdByName(
          'UI/UX Design Website Design With Figma'
        )
      },
      {
        id: '90a8d696-7380-488d-bb39-fc3ec3e11c2d',
        name: 'Pengenalan Prototyping Design',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Mastering Figma: Website UI Animation Design'
        )
      },
      {
        id: '4f372e6b-9f5b-4ce8-bc71-16cb75948d34',
        name: 'Mulai Membuat Animasi Dengan Figma',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Mastering Figma: Website UI Animation Design'
        )
      },
      {
        id: '3062d67c-e17a-46e5-9bcb-8c31045d8a74',
        name: 'Memahami Product Management',
        order_index: 1,
        course_id: await getCourseIdByName('Product Management Fundamentals')
      },
      {
        id: '9580ab8b-bd69-4958-87ee-41fa51722ee0',
        name: 'Value Management',
        order_index: 2,
        course_id: await getCourseIdByName('Product Management Fundamentals')
      },
      {
        id: 'aeffb321-3b60-44de-8b4c-d383938ba840',
        name: 'Strategi dan Perencanaan Product Marketing',
        order_index: 1,
        course_id: await getCourseIdByName('Product Management Marketing')
      },
      {
        id: 'c2bf0f5e-8797-4527-92a5-52eb644f11cd',
        name: 'Keterampilan Utama dalam Product Marketing',
        order_index: 2,
        course_id: await getCourseIdByName('Product Management Marketing')
      },
      {
        id: '497f8c2b-c0fa-4ee0-b342-c07c9bfdb17e',
        name: 'Pengenalan Product Management',
        order_index: 1,
        course_id: await getCourseIdByName(
          'The Concise Product Management Course'
        )
      },
      {
        id: 'de40b4db-1193-423b-8797-05fc953be75e',
        name: 'Proses Pengembangan Produk',
        order_index: 2,
        course_id: await getCourseIdByName(
          'The Concise Product Management Course'
        )
      },
      {
        id: '7a5d822a-c78c-458b-9b1d-8c2ffa94bdfa',
        name: 'Penjelasan Arsitektur',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Web Development Microservice: Website Kelas Online'
        )
      },
      {
        id: '8fe138d5-6d31-4fbb-a3d9-92fc6cc29902',
        name: 'Service Media & Service User',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Web Development Microservice: Website Kelas Online'
        )
      },
      {
        id: '3fbd0e34-76d0-4bdc-be25-0f5b7d6ce0a7',
        name: 'Dasar Website',
        order_index: 1,
        course_id: await getCourseIdByName('Full-Stack Web Developer')
      },
      {
        id: 'faecee5c-ab65-4f16-82e9-1e6406925c8d',
        name: 'Pengembangan Website',
        order_index: 2,
        course_id: await getCourseIdByName('Full-Stack Web Developer')
      },
      {
        id: '9cfd5d13-80d6-4e7a-8ebf-9efeab2c486f',
        name: 'Design Things',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Full-Stack Web Designer: Handoff dan Front-End'
        )
      },
      {
        id: '83b151a1-79d8-48ec-bb18-219871a9d2dd',
        name: 'Pengenalan Frontend',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Full-Stack Web Designer: Handoff dan Front-End'
        )
      },
      {
        id: '318a1ec8-f3bd-4d8d-887a-18f7532389ac',
        name: 'Hal Dasar',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Flutter Developer: Provider State Management'
        )
      },
      {
        id: '83bd67d1-aea6-406e-95ea-b398851dc891',
        name: 'Studi Kasus',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Flutter Developer: Provider State Management'
        )
      },
      {
        id: 'b9752474-43d1-4dcb-9cd2-fc39d745882e',
        name: 'Pengenalan UI Design',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Learn Flutter & Adobe XD: Build a Complete Mobile App'
        )
      },
      {
        id: 'd87dc998-6b43-4369-a2fa-5a203820472f',
        name: 'Tahap UI Design',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Learn Flutter & Adobe XD: Build a Complete Mobile App'
        )
      },
      {
        id: '3fc8f4ae-3ce0-4532-9d99-6b8fd0c1e145',
        name: 'Pengenalan Flutter',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Full-Stack Laravel Flutter: Build e-Wallet Mobile Apps'
        )
      },
      {
        id: 'd2d1bb07-202c-4b26-8cad-031666e8159a',
        name: 'Slicing Page',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Full-Stack Laravel Flutter: Build e-Wallet Mobile Apps'
        )
      },
      {
        id: '1d2d221b-6962-4d31-abe0-5f5b4d9f9911',
        name: 'Dasar Swift',
        order_index: 1,
        course_id: await getCourseIdByName('iOS Development using Swift UI')
      },
      {
        id: '8662ef93-b4bb-474c-b93f-b9d2e6ac08e6',
        name: 'Desain Aplikasi iOS',
        order_index: 2,
        course_id: await getCourseIdByName('iOS Development using Swift UI')
      },
      {
        id: '3f2e8391-448a-4053-8b14-195218adedbe',
        name: 'Pengenalan XCode',
        order_index: 1,
        course_id: await getCourseIdByName(
          'SwiftUI & iOS Engineer: The Complete App Development Bootcamp'
        )
      },
      {
        id: '71957e76-c53d-4c6a-aa1b-4a4859cfc889',
        name: 'Memulai Koding',
        order_index: 2,
        course_id: await getCourseIdByName(
          'SwiftUI & iOS Engineer: The Complete App Development Bootcamp'
        )
      },
      {
        id: 'ab4c7381-b812-4025-939d-2eea56759a37',
        name: 'Dasar Unit Test',
        order_index: 1,
        course_id: await getCourseIdByName('Unit Testing Swift Mobile App')
      },
      {
        id: 'ce329c5a-c405-4d8f-973f-041ad720b1ff',
        name: 'Mulai Implementasi Test',
        order_index: 2,
        course_id: await getCourseIdByName('Unit Testing Swift Mobile App')
      },
      {
        id: '30c202ea-da0c-4c03-9393-6b50f8bfa678',
        name: 'Pengenalan SQL',
        order_index: 1,
        course_id: await getCourseIdByName(
          'SQL for Beginners: Learn SQL using MySQL and Database Design'
        )
      },
      {
        id: '29bcebf0-02e9-4e38-b2f8-ba32010589f3',
        name: 'Dasar SQL',
        order_index: 2,
        course_id: await getCourseIdByName(
          'SQL for Beginners: Learn SQL using MySQL and Database Design'
        )
      },
      {
        id: '334eb0bc-5683-4bf3-9b3b-6bac16d2f6d4',
        name: 'Pengenalan Data Science',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Statistics for Data Science and Business Analysis'
        )
      },
      {
        id: 'b2a97105-cc26-4635-beb2-a32270382bd2',
        name: 'Teori Pemahaman',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Statistics for Data Science and Business Analysis'
        )
      },
      {
        id: '150457e7-1a41-4691-97c7-9a88fbf270a5',
        name: 'Google Spreadsheet',
        order_index: 1,
        course_id: await getCourseIdByName(
          'Basic Spreadsheets For Data Analysis'
        )
      },
      {
        id: 'c0e81ecb-9f4e-4af8-816d-d2abf85e2a43',
        name: 'Memulai Studi Kasus',
        order_index: 2,
        course_id: await getCourseIdByName(
          'Basic Spreadsheets For Data Analysis'
        )
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
