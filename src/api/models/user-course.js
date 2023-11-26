import { Model } from 'sequelize';

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
     * @param {Record<import('./index.js').ModelName, any>} models
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
        // as: 'userId'
      });

      this.belongsTo(models.Course, {
        foreignKey: 'course_id'
        // as: 'courseId'
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
