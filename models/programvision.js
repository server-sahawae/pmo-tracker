"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgramVision extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgramVision.belongsTo(models.Program);
    }
  }
  ProgramVision.init(
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
      description: DataTypes.STRING,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProgramVision",
    }
  );
  return ProgramVision;
};
