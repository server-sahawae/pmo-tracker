"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Position.belongsToMany(models.Partner, {
        through: "PartnerPosition",
      });
      Position.hasMany(models.User);
      Position.belongsToMany(models.PartnerPosition, {
        through: "ProgramPartnerPositions",
        as: "PartnerPositionFromPostition",
      });
    }
  }
  Position.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Position",
    }
  );
  return Position;
};
