import { Model } from 'sequelize';

/**
 * @typedef CourseChapterAttributes
 * @property {string} id
 * @property {string} name
 * @property {number} duration
 * @property {number} order_index
 * @property {string} course_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<CourseChapterAttributes>} */
  class CourseChapter extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<import('./index.js').ModelName, any>} models
     */
    static associate(models) {
      this.hasMany(models.CourseMaterial, {
        foreignKey: 'course_chapter_id',
        as: 'course_material',
        onDelete: 'CASCADE',
        hooks: true
      });

      this.belongsTo(models.Course, {
        foreignKey: 'course_id'
      });
    }
  }

  CourseChapter.init(
    // @ts-ignore
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order_index: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      course_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'CourseChapter',
      tableName: 'course_chapter',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );

  return CourseChapter;
};
