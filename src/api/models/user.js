import { Model } from 'sequelize';

/**
 * @typedef UserAttributes
 * @property {string} id
 * @property {string} name
 * @property {UserRoles} role
 * @property {string} image
 * @property {string} email
 * @property {string} password
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

export const userRoles = /** @type {const} */ (['admin', 'member']);

/** @typedef {(typeof userRoles)[number]} UserRoles */

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
     * @param {Record<'Car', any>} _models
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
      role: {
        type: DataTypes.ENUM(...userRoles),
        allowNull: false,
        defaultValue: 'member',
        validate: {
          isIn: {
            args: [userRoles],
            msg: `Role must be one of ${userRoles.join(', ')}`
          }
        }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'Image is not valid'
          }
        }
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
      password: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User'
    }
  );

  return User;
};
