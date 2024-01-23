"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Program extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Program.belongsTo(models.Partner);
      Program.hasMany(models.ProgramPartner);
      Program.hasMany(models.ProgramVision);
      Program.hasMany(models.ProgramDriver);
      Program.hasMany(models.ProgramIndicator);
      Program.hasMany(models.ProgramPhase);
      Program.hasMany(models.ProgramPriority);
      Program.hasMany(models.ProgramCommittee);
    }
  }
  Program.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      PartnerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Program",
    }
  );

  return Program;
};
