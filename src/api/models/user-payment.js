import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
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
        // as: 'userId'
      });

      this.belongsTo(models.Course, {
        foreignKey: 'course_id'
        // as: 'courseId'
      });
    }
  }

  UserPayment.init(
    {
      paid: DataTypes.BOOLEAN,
      payment_method: {
        type: DataTypes.ENUM('CREDIT_CARD', 'BANK_TRANSFER'),
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
