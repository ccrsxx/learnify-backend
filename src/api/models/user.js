import { Model } from 'sequelize';

/**
 * @typedef UserAttributes
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {boolean} admin
 * @property {string} password
 * @property {string} phone_number
 * @property {Date} createdAt
 * @property {Date} updatedAt
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
     * @param {Record<'', any>} _models
     */
    static associate(_models) {
      // define association here
      // this.hasMany(models.Car, {
      //   foreignKey: 'createdBy',
      //   as: 'createdByUser'
      // });
      // this.hasMany(models.Car, {
      //   foreignKey: 'updatedBy',
      //   as: 'updatedByUser'
      // });
      // this.hasMany(models.Car, {
      //   foreignKey: 'deletedBy',
      //   as: 'deletedByUser'
      // });
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
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'user',
      underscored: true
    }
  );

  return User;
};
