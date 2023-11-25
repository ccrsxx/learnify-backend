'use strict';

import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  class CourseCategory extends Model {
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
      this.hasMany(models.Course, {
        foreignKey: 'course_category'
        // as: 'courseCategory'
      });
    }
  }

  CourseCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'CourseCategory',
      tableName: 'course_category',
      underscored: true
    }
  );

  return CourseCategory;
};
