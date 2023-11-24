'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class course_material extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     */
    static associate(_models) {
      // define association here
    }
  }
  course_material.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      video: {
        type: DataTypes.STRING,
        allowNull: false
      },
      order_index: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      course_chapter_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'course_material',
      underscored: true
    }
  );
  return course_material;
};
