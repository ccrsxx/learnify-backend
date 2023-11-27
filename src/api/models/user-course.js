import { Model } from 'sequelize';

/**
 * @typedef UserCourseAttributes
 * @property {string} id
 * @property {string} user_id
 * @property {string} course_id
 * @property {boolean} onboarded
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<UserCourseAttributes>} */
  class UserCourse extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<import('./index.js').ModelName, any>} models
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      });

      this.belongsTo(models.Course, {
        foreignKey: 'course_id'
      });
    }
  }

  UserCourse.init(
    // @ts-ignore
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
