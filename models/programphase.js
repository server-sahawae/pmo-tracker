"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgramPhase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgramPhase.belongsTo(models.Program);
    }
  }
  ProgramPhase.init(
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
      description: DataTypes.STRING,
      quarter: DataTypes.INTEGER,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProgramPhase",
    }
  );
  return ProgramPhase;
};
