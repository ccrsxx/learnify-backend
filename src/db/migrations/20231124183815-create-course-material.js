'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_material', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      video: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order_index: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      course_chapter_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'course_chapter',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('course_material');
  }
};
