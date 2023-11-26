import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  class CourseMaterialStatus extends Model {
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

      this.belongsTo(models.CourseMaterial, {
        foreignKey: 'course_material_id'
        // as: 'courseMaterialId'
      });
    }
  }
  CourseMaterialStatus.init(
    {
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      course_material_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'CourseMaterialStatus',
      tableName: 'course_material_status',
      underscored: true
    }
  );
  return CourseMaterialStatus;
};
