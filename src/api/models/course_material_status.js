'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class course_material_status extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     */
    static associate(_models) {
      // define association here
    }
  }
  course_material_status.init(
    {
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      course_material_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'course_material_status',
      underscored: true
    }
  );
  return course_material_status;
};
