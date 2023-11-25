'use strict';
import { Model } from 'sequelize';
/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<'', any>} models
     */
    static associate(models) {
      // define association here
      // @ts-ignore
      this.hasMany(models.UserPayment, {
        foreignKey: 'course_id'
        // as: 'course_id'
      });

      // @ts-ignore
      this.hasMany(models.UserCourse, {
        foreignKey: 'course_id'
        // as: 'course_id'
      });

      // @ts-ignore
      this.hasMany(models.CourseChapter, {
        foreignKey: 'course_id'
        // as: 'courseId'
      });

      // @ts-ignore
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
        // as: 'user_id'
      });

      // @ts-ignore
      this.belongsTo(models.CourseCategory, {
        foreignKey: 'course_category'
        // as: 'course_category'
      });
    }
  }

  Course.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rating: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      premium: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      telegram: {
        type: DataTypes.STRING,
        allowNull: false
      },
      difficulty: {
        type: DataTypes.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      intro_video: {
        type: DataTypes.STRING,
        allowNull: false
      },
      onboarding_text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      target_audience: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      course_category_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Course',
      tableName: 'course',
      underscored: true
    }
  );

  return Course;
};
