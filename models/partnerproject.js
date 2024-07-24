"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PartnerProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PartnerProject.belongsTo(models.Partner);
      PartnerProject.belongsTo(models.Project);
    }
  }
  PartnerProject.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      PartnerId: DataTypes.UUIDV4,
      ProjectId: DataTypes.UUIDV4,
      UserId: DataTypes.UUIDV4,
      isOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdBy: { type: DataTypes.UUIDV4, references: "Users" },
    },
    {
      sequelize,
      modelName: "PartnerProject",
    }
  );
  return PartnerProject;
};
