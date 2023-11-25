'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const { generateCategory } = await import('../../libs/seed.js');

    return queryInterface.bulkInsert('Course_categories', generateCategory());
  },

  async down(_queryInterface, _Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example: await queryInterface.bulkDelete('People', null, {});
     */
  }
};
