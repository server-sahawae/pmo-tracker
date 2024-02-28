"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PartnerPosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PartnerPosition.belongsToMany(models.Program, {
        through: "ProgramPartnerPositions",
        as: "PartnerPosition",
      });
      PartnerPosition.hasMany(models.ProgramPartnerPosition, {
        as: "ProgramCommittee",
      });
      PartnerPosition.belongsTo(models.Partner);
      PartnerPosition.belongsTo(models.Position);
    }
  }
  PartnerPosition.init(
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
      PositionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      // name: DataTypes.STRING,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "PartnerPosition",
    }
  );
  return PartnerPosition;
};
