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
        name: 'Apa itu Figma?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Figma')
      },
      {
        id: 'c79437fd-cf2f-4f17-9ed7-446811a62669',
        name: 'Registrasi Akun Figma',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Figma')
      },
      {
        id: 'abd244c7-5f79-4e46-80c9-2c89846f1738',
        name: 'Setup Project Figma',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Design Sederhana Dengan Figma'
        )
      },
      {
        id: '0a9a22d9-ea08-4aa6-99c5-0856e3c47972',
        name: 'Grid System Figma',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Design Sederhana Dengan Figma'
        )
      },
      {
        id: 'b3e35579-7cbf-43f2-96b4-fb72dc354027',
        name: 'Apa itu Frontend?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Frontend')
      },
      {
        id: '9177cb7e-ab04-4135-b108-ecebb53d5e72',
        name: 'Tools Frontend',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Frontend')
      },
      {
        id: 'c7e2a973-d05c-4ea4-80ce-8f0622fbbdbf',
        name: 'Apa itu HTML?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan HTML & CSS'
        )
      },
      {
        id: '342918ca-710f-4800-8460-01e398fc85f4',
        name: 'Apa itu CSS?',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan HTML & CSS'
        )
      },
      {
        id: 'a34858de-4585-47f0-892c-3660ad3cc032',
        name: 'Apa itu Fullstack?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Fullstack'
        )
      },
      {
        id: '5af29bb7-4a50-4cbe-ba15-f1f08de6e7dc',
        name: 'Setup dan Tools Course',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Fullstack'
        )
      },
      {
        id: 'f2e7693a-4e22-49bc-bfea-4b1752582a5d',
        name: 'Apa itu Programming?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Fundamental Programming'
        )
      },
      {
        id: '7434f4c3-1354-4ca2-8cc4-032c2520b4aa',
        name: 'Apa itu React Native?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan React Native'
        )
      },
      {
        id: '0a94e7b9-d22a-4011-ac20-8b4a09ce9ef6',
        name: 'Apa itu Component?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Component'
        )
      },
      {
        id: 'a743589a-0869-43ce-bbe2-2d8d4c0e01c7',
        name: 'Apa itu Flutter?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Flutter')
      },
      {
        id: '77a87bd4-ee11-4dc5-ab62-359bb1b11e58',
        name: 'Requirement untuk install Flutter',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Instalasi Flutter')
      },
      {
        id: '44f1da4c-7c2a-4a23-b6b8-198fe7f9ca66',
        name: 'Apa itu Swift?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Swift')
      },
      {
        id: '702ffc93-220e-485a-8e72-762ca756d851',
        name: 'Pengenalan Xcode',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Memulai dengan Swift'
        )
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
