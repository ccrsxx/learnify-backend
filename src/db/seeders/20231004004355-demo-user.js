/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const { generateRandomUser } = await import('../../libs/seed.js');

    return queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 100 }, generateRandomUser)
    );
  },
  down: (queryInterface, _Sequelize) => {
    // @ts-ignore
    return queryInterface.bulkDelete('Users', null, {});
  }
};
