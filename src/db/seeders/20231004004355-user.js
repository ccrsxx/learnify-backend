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
      password: '$2b$10$S5jendkv1xbBWqPrZxqN7.PtnPAPPHoa94/8LzmjEZQp2ZdiWTB3u',
      phone_number: '+6289876543210'
    };

    const normalUser = {
      ...generateRandomUser(),
      id: '68a58152-8b12-449f-9eae-ec3485941bac',
      name: 'Rem',
      admin: false,
      email: 'rem@rezero.com',
      password: '$2b$10$8sk6Ypf8lO2OylTRM69oCuqqRAU9gQm4tbn9kwHf7iBNeoVdqUeaK',
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
