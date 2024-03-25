"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgramPartnerPosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgramPartnerPosition.belongsTo(models.Program);
      // ProgramPartnerPosition.belongsTo(models.PartnerPosition, {
      //   as: "PartnerPositionFromPostition",
      //   foreignKey: "PartnerPositionId",
      // });
      ProgramPartnerPosition.belongsTo(models.PartnerPosition, {
        // as: "ProgramCommittee",
        // foreignKey: "  PartnerPositionId",
      });
    }
  }
  ProgramPartnerPosition.init(
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
      PartnerPositionId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProgramPartnerPosition",
    }
  );
  return ProgramPartnerPosition;
};
