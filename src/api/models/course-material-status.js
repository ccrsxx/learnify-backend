import { Model } from 'sequelize';

/**
 * @typedef CourseMaterialStatusAttributes
 * @property {string} id
 * @property {boolean} completed
 * @property {string} user_id
 * @property {string} course_material_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<CourseMaterialStatusAttributes>} */
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
      });

      this.belongsTo(models.CourseMaterial, {
        foreignKey: 'course_material_id'
      });
    }
  }
  CourseMaterialStatus.init(
    // @ts-ignore
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
