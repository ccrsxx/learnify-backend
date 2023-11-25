'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const { generateCategory } = await import('../../libs/seed.js');

    return queryInterface.bulkInsert('course_category', generateCategory());
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('course_category', null, {});
  }
};
