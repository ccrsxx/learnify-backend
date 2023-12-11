import { Model } from 'sequelize';

/**
 * @typedef UserPaymentAttributes
 * @property {string} id
 * @property {PaymentStatus} status
 * @property {PaymentMethod} payment_method
 * @property {string} user_id
 * @property {string} course_id
 * @property {Date} paid_at
 * @property {Date} expired_at
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export const Models = {};

const PAYMENT_METHOD = /** @type {const} */ (['CREDIT_CARD', 'BANK_TRANSFER']);
const PAYMENT_STATUS = /** @type {const} */ ([
  'PENDING',
  'WAITING_VERIFICATION',
  'COMPLETED'
]);

/** @typedef {(typeof PAYMENT_METHOD)[number]} PaymentMethod */

/** @typedef {(typeof PAYMENT_STATUS)[number]} PaymentStatus */

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
      status: {
        type: DataTypes.ENUM(...PAYMENT_STATUS),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      payment_method: {
        type: DataTypes.ENUM(...PAYMENT_METHOD)
      },
      paid_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      course_id: { type: DataTypes.UUID, allowNull: false },
      expired_at: { type: DataTypes.DATE, allowNull: false }
    },
    {
      sequelize,
      modelName: 'UserPayment',
      tableName: 'user_payment',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );

  return UserPayment;
};
