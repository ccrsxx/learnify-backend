import { Model } from 'sequelize';

/**
 * @typedef CourseCategoryAttributes
 * @property {string} id
 * @property {string} name
 * @property {string} image
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<CourseCategoryAttributes>} */
  class CourseCategory extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<import('./index.js').ModelName, any>} models
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Course, {
        foreignKey: 'course_category_id'
      });
    }
  }

  CourseCategory.init(
    // @ts-ignore
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
