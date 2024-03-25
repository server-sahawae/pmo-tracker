"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PartnerProjectActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PartnerProjectActivity.belongsTo(models.Partner);
      PartnerProjectActivity.belongsTo(models.Project);
      PartnerProjectActivity.belongsTo(models.Activity);
    }
  }
  PartnerProjectActivity.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      PartnerId: DataTypes.UUIDV4,
      ProjectId: DataTypes.UUIDV4,
      ActivityId: DataTypes.UUIDV4,
      UserId: DataTypes.UUIDV4,
      isOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "PartnerProjectActivity",
    }
  );
  return PartnerProjectActivity;
};
