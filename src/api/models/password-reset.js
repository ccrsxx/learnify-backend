import { Model } from 'sequelize';

/**
 * @typedef PasswordResetAttributes
 * @property {string} id
 * @property {boolean} used
 * @property {string} token
 * @property {Date} expired_at
 * @property {string} user_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<PasswordResetAttributes>} */
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<import('./index.js').ModelName, any>} models
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  PasswordReset.init(
    // @ts-ignore
    {
      used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      token: { type: DataTypes.STRING, allowNull: false },
      expired_at: { type: DataTypes.DATE, allowNull: false },
      user_id: { type: DataTypes.UUID, allowNull: false }
    },
    {
      sequelize,
      modelName: 'PasswordReset',
      tableName: 'password_resets',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );
  return PasswordReset;
};
