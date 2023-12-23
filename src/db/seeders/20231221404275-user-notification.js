/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(_queryInterface, _Sequelize) {
    const { UserNotification } = await import('../../api/models/index.js');

    const { getNormalUserId } = await import('../../libs/seed.js');

    const { createUserNotification } = await import(
      '../../api/services/user-notification.js'
    );

    const tableHasInitialValue = (await UserNotification.count()) > 2;

    if (tableHasInitialValue) return;

    const normalUserId = /** @type {string} */ (await getNormalUserId());

    await createUserNotification(normalUserId, {
      name: 'Welcome to the course',
      description: 'Welcome to the course'
    });
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('user_notification', null, {});
  }
};
