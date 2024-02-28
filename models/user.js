"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.PartnerPosition);
      User.belongsTo(models.UserLevel);
      User.hasMany(models.ProjectInvitation);
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      PartnerPositionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      kta: DataTypes.STRING,
      position: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      GoogleId: DataTypes.STRING,
      picture: DataTypes.BLOB,
      UserLevelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
