"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserUserLevel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserUserLevel.belongsTo(models.User);
      UserUserLevel.belongsTo(models.UserLevel);
    }
  }
  UserUserLevel.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      UserId: DataTypes.UUID,
      UserLevelId: DataTypes.UUID,
      createdBy: { type: DataTypes.UUID, references: "Users" },
    },
    {
      sequelize,
      modelName: "UserUserLevel",
    }
  );
  return UserUserLevel;
};
