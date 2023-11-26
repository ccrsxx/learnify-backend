import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
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
        foreignKey: 'course_chapter_id'
        // as: 'courseChapterId'
      });

      this.belongsTo(models.Course, {
        foreignKey: 'course_id'
        // as: 'courseId'
      });
    }
  }

  CourseChapter.init(
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
      underscored: true
    }
  );

  return CourseChapter;
};
