import { Model } from 'sequelize';
import isMobilePhone from 'validator/lib/isMobilePhone.js';

/**
 * @typedef UserAttributes
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {boolean} admin
 * @property {string} password
 * @property {string} phone_number
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<UserAttributes>} */
  class User extends Model {
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
        foreignKey: 'user_id'
      });

      this.hasMany(models.UserCourse, {
        foreignKey: 'user_id'
      });

      this.hasMany(models.CourseMaterialStatus, {
        foreignKey: 'user_id'
      });

      this.hasMany(models.Course, {
        foreignKey: 'user_id'
      });

      this.hasMany(models.PasswordReset, {
        foreignKey: 'user_id'
      });
    }
  }

  User.init(
    // @ts-ignore
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: 'Name must be at least 3 characters'
          }
        }
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'email',
          msg: 'Email already exists'
        },
        validate: {
          isEmail: {
            msg: 'Email is not valid'
          }
        }
      },
      password: DataTypes.STRING,
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'phone number',
          msg: 'Phone number already exists'
        },
        validate: {
          /** @param {string | number} value */
          isPhoneNumber(value) {
            if (
              !isMobilePhone.default(String(value), 'id-ID', {
                strictMode: true
              })
            ) {
              throw new Error('Phone number is not valid');
            }
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'user',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );

  return User;
};
