"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectProgramIndicator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectProgramIndicator.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ProjectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      IndicatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProjectProgramIndicator",
    }
  );
  return ProjectProgramIndicator;
};
