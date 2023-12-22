import { Model } from 'sequelize';

/**
 * @typedef OtpAttributes
 * @property {string} id
 * @property {string} otp
 * @property {boolean} used
 * @property {string} user_id
 * @property {Date} expired_at
 * @property {Date} created_at
 * @property {Date} updated_at
 */
export const Models = {};

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<OtpAttributes>} */
  class Otp extends Model {
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
  Otp.init(
    // @ts-ignore
    {
      otp: { type: DataTypes.INTEGER, allowNull: false },
      used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      user_id: { type: DataTypes.UUID, allowNull: false },
      expired_at: { type: DataTypes.DATE, allowNull: false }
    },
    {
      sequelize,
      modelName: 'Otp',
      tableName: 'otp',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );
  return Otp;
};
