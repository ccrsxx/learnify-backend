'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_payment', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      payment_status: {
        type: Sequelize.ENUM('PENDING', 'WAITING_VERIFICATION', 'COMPLETED'),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.ENUM('CREDIT_CARD', 'BANK_TRANSFER')
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'course',
          key: 'id'
        }
      },
      expired_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('user_payment');
  }
};
