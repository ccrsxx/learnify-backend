/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const { isTableHasRecords, getCourseIdByName, backfillUserCourse } =
      await import('../../libs/seed.js');

    if (await isTableHasRecords('user_course', queryInterface)) return;

    const courseIds = /** @type {string[]} */ (
      await Promise.all([
        getCourseIdByName('Intro to Design System'),
        getCourseIdByName('Full-Stack Web Developer')
      ])
    );

    await Promise.all(courseIds.map(backfillUserCourse));
  },

  async down(queryInterface, _Sequelize) {
    const tableToReset = [
      'user_course',
      'user_payment',
      'course_material_status'
    ];

    await Promise.all(
      tableToReset.map((tableName) =>
        // @ts-ignore
        queryInterface.bulkDelete(tableName, null)
      )
    );
  }
};
