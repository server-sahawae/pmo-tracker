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
      ProjectProgramIndicator.belongsTo(models.Program);
      ProjectProgramIndicator.belongsTo(models.Project);
      ProjectProgramIndicator.belongsTo(models.ProgramIndicator);
    }
  }
  ProjectProgramIndicator.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ProgramId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      ProjectId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      ProgramIndicatorId: {
        type: DataTypes.UUIDV4,
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
