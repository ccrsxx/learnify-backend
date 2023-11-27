'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course', {
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
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rating: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      premium: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      telegram: {
        type: Sequelize.STRING,
        allowNull: false
      },
      difficulty: {
        type: Sequelize.ENUM,
        values: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      intro_video: {
        type: Sequelize.STRING,
        allowNull: false
      },
      onboarding_text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      target_audience: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      course_category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'course_category',
          key: 'id'
        }
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
    await queryInterface.dropTable('course');
  }
};
