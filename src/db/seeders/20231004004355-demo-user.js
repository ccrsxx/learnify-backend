/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const { isTableEmpty, generateRandomUser } = await import(
      '../../libs/seed.js'
    );

    if (!(await isTableEmpty('user', queryInterface))) return;

    const adminUser = {
      ...generateRandomUser(),
      id: '68a58152-8b12-449f-9eae-ec3485941bad',
      name: 'Emilia',
      admin: true,
      email: 'emilia@rezero.com',
      password: 'emilia'
    };

    const normalUser = {
      ...generateRandomUser(),
      id: '68a58152-8b12-449f-9eae-ec3485941bac',
      name: 'Rem',
      admin: false,
      email: 'rem@rezero.com',
      password: 'rem'
    };

    const seedUsers = [adminUser, normalUser];

    return queryInterface.bulkInsert('user', seedUsers);
  },
  down: (queryInterface, _Sequelize) => {
    // @ts-ignore
    return queryInterface.bulkDelete('user', null, {});
  }
};
