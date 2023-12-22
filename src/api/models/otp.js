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
  class OtpVerify extends Model {
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
  OtpVerify.init(
    // @ts-ignore
    {
      otp: DataTypes.INTEGER,
      used: DataTypes.BOOLEAN,
      user_id: DataTypes.UUID,
      expired_at: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'OtpVerify',
      tableName: 'otps',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );
  return OtpVerify;
};
