'use strict';

import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  class CourseMaterial extends Model {
    /**
     * Helper method for defining associations. This method is not a part of
     * Sequelize lifecycle. The `models/index` file will call this method
     * automatically.
     *
     * @param {Record<'', any>} _models
     */
    static associate(_models) {
      // define association here
    }
  }

  CourseMaterial.init(
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
      modelName: 'CourseMaterial',
      tableName: 'course_material',
      underscored: true
    }
  );

  return CourseMaterial;
};
