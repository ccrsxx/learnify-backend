/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const {
      getUserIdByAdmin,
      isTableHasRecords,
      getCourseIdByName,
      generateRandomUserCourse
    } = await import('../../libs/seed.js');

    if (await isTableHasRecords('user_course', queryInterface)) return;

    const userAdminId = await getUserIdByAdmin();

    const userCourses = [
      {
        id: 'f68090a7-133e-4e7d-843b-d0f28ed058ea',
        onboarded: false,
        user_id: userAdminId,
        course_id: await getCourseIdByName('Intro to Design System')
      }
    ];

    const seedUserCourses = userCourses.map((material) => ({
      ...generateRandomUserCourse(),
      ...material
    }));

    return queryInterface.bulkInsert('user_course', seedUserCourses);
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('user_course', null, {});
  }
};
