import { Model } from 'sequelize';

/**
 * @typedef UserPaymentAttributes
 * @property {string} id
 * @property {boolean} paid
 * @property {PaymentMethod} payment_method
 * @property {string} user_id
 * @property {string} course_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

const PAYMENT_METHOD = /** @type {const} */ (['CREDIT_CARD', 'BANK_TRANSFER']);

/** @typedef {(typeof PAYMENT_METHOD)[number]} PaymentMethod */

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  /** @extends {Model<UserPaymentAttributes>} */
  class UserPayment extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<import('./index.js').ModelName, any>} models
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      });

      this.belongsTo(models.Course, {
        foreignKey: 'course_id'
      });
    }
  }

  UserPayment.init(
    // @ts-ignore
    {
      paid: DataTypes.BOOLEAN,
      payment_method: {
        type: DataTypes.ENUM(...PAYMENT_METHOD),
        allowNull: false
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      course_id: { type: DataTypes.UUID, allowNull: false }
    },
    {
      sequelize,
      modelName: 'UserPayment',
      tableName: 'user_payment',
      underscored: true
    }
  );

  return UserPayment;
};
