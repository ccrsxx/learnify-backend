import { Model } from 'sequelize';

/**
 * @typedef CourseAttributes
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {number} price
 * @property {string} author
 * @property {string} image
 * @property {number} rating
 * @property {boolean} premium
 * @property {string} telegram
 * @property {Difficulty} difficulty
 * @property {string} description
 * @property {string} intro_video
 * @property {string} onboarding_text
 * @property {string[]} target_audience
 * @property {string} user_id
 * @property {string} course_category_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

export const DIFFICULTY = /** @type {const} */ ([
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED'
]);

/** @typedef {(typeof DIFFICULTY)[number]} Difficulty */

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<CourseAttributes>} */
  class Course extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<import('./index.js').ModelName, any>} models
     */
    static associate(models) {
      // define association here
      this.hasMany(models.UserPayment, {
        foreignKey: 'course_id'
      });

      this.hasMany(models.UserCourse, {
        foreignKey: 'course_id',
        as: 'user_course'
      });

      this.hasMany(models.CourseChapter, {
        foreignKey: 'course_id',
        as: 'course_chapter'
      });

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      this.belongsTo(models.CourseCategory, {
        foreignKey: 'course_category_id',
        as: 'course_category'
      });
    }
  }

  Course.init(
    // @ts-ignore
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'code',
          msg: 'Code must be unique'
        }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      rating: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      premium: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      telegram: {
        type: DataTypes.STRING,
        allowNull: false
      },
      difficulty: {
        type: DataTypes.ENUM(...DIFFICULTY),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      intro_video: {
        type: DataTypes.STRING,
        allowNull: false
      },
      onboarding_text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      target_audience: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      course_category_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Course',
      tableName: 'course',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );

  return Course;
};
