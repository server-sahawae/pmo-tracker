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
      User.hasMany(models.ProjectInvitation);
      User.hasMany(models.UserUserLevel);
      User.hasMany(models.UserPartnerProgramProjectActivity);
      User.hasMany(models.UserPartnerProgramProjectActivity, { as: "Creator" });
      User.belongsToMany(models.UserLevel, {
        through: models.UserUserLevel,
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      PartnerPositionId: {
        type: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      email: { type: DataTypes.STRING, validate: { isEmail: true } },
      phone: DataTypes.STRING,
      picture: DataTypes.STRING,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
