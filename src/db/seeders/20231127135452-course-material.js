/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const {
      isTableHasRecords,
      getCourseChapterIdByName,
      generateRandomCourseMaterial
    } = await import('../../libs/seed.js');

    if (await isTableHasRecords('course_material', queryInterface)) return;

    const courseMaterials = [
      {
        id: 'c12dd512-0015-43a2-8fb7-004cbfdb6cf8',
        name: 'Kapan Membangun Design System?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Design System'
        ),
        video: 'https://youtu.be/ChdiLQ1iy5o'
      },
      {
        id: 'abd244c7-5f79-4e46-80c9-2c89846f1738',
        name: 'Tools Utama Membuat Design System',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Workflow Membangun Design System'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'c79437fd-cf2f-4f17-9ed7-446811a62669',
        name: 'Syarat Awal Membangun Design System',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Workflow Membangun Design System'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '8b24ff2c-8ba1-4970-ad5d-cb3e11c9edf7',
        name: 'Apa itu Product?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Memahami Product Management'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'd0c0c841-2ee9-4a30-8529-a9e33daabb42',
        name: 'Apa itu Value?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Value Management'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '33862af4-8b10-4f91-a139-ac4f3e39fd16',
        name: 'Memahami Value Management',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Value Management'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'f9e1d65f-cad5-43ad-b7c2-a4922cc498f9',
        name: 'Set Up API Gateway',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Penjelasan Arsitektur'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '512e586e-8cda-4a84-a952-f4a9a23e6a67',
        name: 'Penjelasan Service Media',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Service Media & Service User'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'e9db87ce-e567-4bda-912f-9087dcd439ec',
        name: 'Penjelasan Service User',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Service Media & Service User'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'b579193f-cb57-4e4f-a09e-2722872a52b9',
        name: 'Tools UI Designer',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Dasar Website'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'f514f534-31c3-49df-a451-dc51da335c1c',
        name: 'Persona',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengembangan Website'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'ac56106d-967a-464b-822b-dad4196e4631',
        name: 'Benchmarking',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengembangan Website'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'e3670ac9-187e-49c3-938c-724545cafc1b',
        name: 'Provider Fundamental',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Hal Dasar'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'f6691a76-e474-48ce-b78b-fbd10094cabd',
        name: 'Memahami Alur Project',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Studi Kasus'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '0c3e80c5-96c9-4a6b-b8d0-1f097676f4f3',
        name: 'Tes & Analisis API',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Studi Kasus'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '503e4101-5225-4419-ab51-d18ff4779810',
        name: 'Apa itu UI/UX',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan UI Design'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '25449801-ff40-40f6-9173-b8c398b68480',
        name: 'Tipografi & Font',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Tahap UI Design'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'df5179cc-d44b-46ce-946d-a0eb22a52800',
        name: 'Grid & Jarak',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Tahap UI Design'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '24cb0e9e-7d4b-4f03-b36a-041b4aedd38e',
        name: 'Workspace XCode',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan XCode'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'd87511ba-42db-4fb7-8e8a-974f9501c1f7',
        name: 'Membuat Color Pallete',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Memulai Koding'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'ed4e4ee2-87f6-460f-973f-d31b57c719fb',
        name: 'Kustomisasi Font',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Memulai Koding'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '092ae275-9e02-452e-9c22-3a6c3edc2e63',
        name: 'Apa itu SQL?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan SQL'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '3fe745b5-c82a-43e3-a1b1-0134e15d8004',
        name: 'Apa itu Database?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Dasar SQL'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '72e75e80-29ad-4114-9672-1771e4a20d06',
        name: 'Field & Data Type',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Dasar SQL'),
        video: 'https://youtu.be/rd-590n3H6w'
      }
    ];

    const seedCourseMaterials = courseMaterials.map((material) => ({
      ...generateRandomCourseMaterial(),
      ...material
    }));

    return queryInterface.bulkInsert('course_material', seedCourseMaterials);
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('course__material', null, {});
  }
};
