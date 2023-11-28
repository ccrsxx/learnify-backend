/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const { isTableHasRecords, generateRandomUser } = await import(
      '../../libs/seed.js'
    );

    if (await isTableHasRecords('user', queryInterface)) return;

    const adminUser = {
      ...generateRandomUser(),
      id: '68a58152-8b12-449f-9eae-ec3485941bad',
      name: 'Emilia',
      admin: true,
      email: 'emilia@rezero.com',
      password: '$2b$10$83jR0dcXC7.bS5TLe288yu6DMgeAgB4IkDA1swej4SUNmjD.DwIbu',
      phone_number: '+6289876543210'
    };

    const normalUser = {
      ...generateRandomUser(),
      id: '68a58152-8b12-449f-9eae-ec3485941bac',
      name: 'Rem',
      admin: false,
      email: 'rem@rezero.com',
      password: '$2b$10$ajTX6qtrFWc4eHDAbXblxepkmKK3D1vJTVEYwU2khOITajzTASCCy',
      phone_number: '+6281234567890'
    };

    const seedUsers = [adminUser, normalUser];

    return queryInterface.bulkInsert('user', seedUsers);
  },
  down: (queryInterface, _Sequelize) => {
    // @ts-ignore
    return queryInterface.bulkDelete('user', null, {});
  }
};
