"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgramDriver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgramDriver.belongsTo(models.Program);
    }
  }
  ProgramDriver.init(
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
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProgramDriver",
    }
  );
  return ProgramDriver;
};
