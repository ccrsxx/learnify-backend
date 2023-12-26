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
      image:
        'https://res.cloudinary.com/dnipscdmt/image/upload/v1703308890/iynjqrgrln1jueqymwsc.gif',
      verified: true,
      password: '$2b$10$S5jendkv1xbBWqPrZxqN7.PtnPAPPHoa94/8LzmjEZQp2ZdiWTB3u', // emilia-rezero
      phone_number: '+6289876543210'
    };

    const normalUser = {
      ...generateRandomUser(),
      id: '68a58152-8b12-449f-9eae-ec3485941bac',
      name: 'Rem',
      admin: false,
      email: 'rem@rezero.com',
      verified: true,
      password: '$2b$10$8sk6Ypf8lO2OylTRM69oCuqqRAU9gQm4tbn9kwHf7iBNeoVdqUeaK', // rem-rezero
      phone_number: '+6281234567890'
    };

    const secondNormalUser = {
      ...generateRandomUser(),
      id: '6a28814a-956d-4b9e-a052-f4b918898cde',
      name: 'Risal Amin',
      admin: false,
      email: 'aminrisal@gmail.com',
      verified: true,
      password: '$2b$10$atdYjR8rXBN1QwPoMEnpneUwiQT3Y4IM5da3jxA.wJs6Ea4i.ChOW', // i-love-emilia
      phone_number: '+6285925300629'
    };

    const seedUsers = [adminUser, normalUser, secondNormalUser];

    return queryInterface.bulkInsert('user', seedUsers);
  },
  down: (queryInterface, _Sequelize) => {
    // @ts-ignore
    return queryInterface.bulkDelete('user', null, {});
  }
};
