"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Partner.belongsTo(models.Institution);
      Partner.hasMany(models.Program);
      Partner.belongsToMany(models.Position, { through: "PartnerPosition" });
      Partner.hasMany(models.ProgramPartner);
      Partner.hasMany(models.User);
      Partner.belongsToMany(models.Position, {
        through: "PartnerPositions",
      });
      Partner.hasMany(models.PartnerProjectActivity);
    }
  }
  Partner.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      InstitutionId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      no: DataTypes.INTEGER,
      name: DataTypes.STRING,
      chief: DataTypes.STRING,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Partner",
    }
  );
  return Partner;
};
