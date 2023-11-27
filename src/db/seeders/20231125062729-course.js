/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const {
      isTableEmpty,
      getUserIdByAdmin,
      getCategoryIdByName,
      generateRandomCourse
    } = await import('../../libs/seed.js');

    if (!(await isTableEmpty('course', queryInterface))) return;

    const userAdminId = await getUserIdByAdmin();

    const courses = [
      {
        id: 'c63a172f-4eb1-44b2-8c90-66336b016d8f',
        name: 'Belajar Figma',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('UI/UX Design')
      },
      {
        id: '5db0a017-6041-4d9a-8f44-5fca03d5378a',
        name: 'Belajar Fullstack developer',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Web Development')
      },
      {
        id: '0d7925a7-0c68-4c25-9c9a-c1f346bdc9fc',
        name: 'Belajar Frontend developer',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Web Development')
      },
      {
        id: 'f3102f7e-9916-4ff8-a50c-60048f7b634c',
        name: 'Belajar React Native',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Android Development')
      },
      {
        id: 'c3964d15-6932-4dff-aaae-84bed19707b1',
        name: 'Belajar Flutter',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Android Development')
      },
      {
        id: 'b4863ea2-0fb8-46ca-97e7-ee8a817b7f70',
        name: 'Belajar Swift',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('IOS Development')
      }
    ];

    const seedCourses = courses.map((category) => ({
      ...generateRandomCourse(),
      ...category
    }));

    return queryInterface.bulkInsert('course', seedCourses);
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('course', null, {});
  }
};
