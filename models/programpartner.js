"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgramPartner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgramPartner.belongsTo(models.Program);
      ProgramPartner.belongsTo(models.Partner);
    }
  }
  ProgramPartner.init(
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
      PartnerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProgramPartner",
    }
  );
  return ProgramPartner;
};
