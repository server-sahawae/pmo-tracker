"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPartnerProgramProjectActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPartnerProgramProjectActivity.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      UserId: DataTypes.UUID,
      PartnerId: DataTypes.UUID,
      ProgramId: DataTypes.UUID,
      ProjectId: DataTypes.UUID,
      ActivityId: DataTypes.UUID,
      createdBy: { type: DataTypes.UUIDV4, references: "Users" },
    },
    {
      sequelize,
      modelName: "UserPartnerProgramProjectActivity",
    }
  );
  return UserPartnerProgramProjectActivity;
};
