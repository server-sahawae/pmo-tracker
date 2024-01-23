"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgramPriority extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgramPriority.belongsTo(models.Program);
      ProgramPriority.belongsTo(models.Priority);
    }
  }
  ProgramPriority.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ProgramId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      PriorityId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProgramPriority",
    }
  );
  return ProgramPriority;
};
