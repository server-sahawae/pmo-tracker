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
    }
  }
  PartnerProjectActivity.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      PartnerId: DataTypes.UUID,
      ProjectId: DataTypes.UUID,
      ActivityId: DataTypes.UUID,
      isOwner: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PartnerProjectActivity",
    }
  );
  return PartnerProjectActivity;
};
