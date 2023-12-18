import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  class UserNotification extends Model {
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
    }
  }
  UserNotification.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      viewed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'UserNotification',
      tableName: 'user_notification',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true
    }
  );
  return UserNotification;
};
