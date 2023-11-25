'use strict';
import { Model } from 'sequelize';
export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

export default (sequelize, DataTypes) => {
  class UserCourse extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<'', any>} models
     */
    static associate(models) {
      // @ts-ignore
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
        // as: 'user_id'
      });

      // @ts-ignore
      this.belongsTo(models.Course, {
        foreignKey: 'course_id'
        // as: 'course_id'
      });
    }
  }

  UserCourse.init(
    {
      user_id: { type: DataTypes.UUID, allowNull: false },
      onboarded: { type: DataTypes.BOOLEAN, allowNull: false },
      course_id: { type: DataTypes.UUID, allowNull: false }
    },
    {
      sequelize,
      modelName: 'UserCourse',
      tableName: 'user_course',
      underscored: true
    }
  );

  return UserCourse;
};
