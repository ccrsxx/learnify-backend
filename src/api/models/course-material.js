import { Model } from 'sequelize';

/**
 * @typedef CourseMaterialAttributes
 * @property {string} id
 * @property {string} name
 * @property {string} video
 * @property {number} order_index
 * @property {string} course_chapter_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<CourseMaterialAttributes>} */
  class CourseMaterial extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<import('./index.js').ModelName, any>} models
     */
    static associate(models) {
      this.hasMany(models.CourseMaterialStatus, {
        foreignKey: 'course_material_id'
      });

      this.belongsTo(models.CourseChapter, {
        foreignKey: 'course_chapter_id'
      });
    }
  }

  CourseMaterial.init(
    // @ts-ignore
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      video: {
        type: DataTypes.STRING,
        allowNull: false
      },
      order_index: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      course_chapter_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'CourseMaterial',
      tableName: 'course_material',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );

  return CourseMaterial;
};
