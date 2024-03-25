"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Priority extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Priority.hasMany(models.ProgramPriority);
    }
  }
  Priority.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      keyword: DataTypes.STRING,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Priority",
    }
  );
  return Priority;
};
