"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discussion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discussion.belongsTo(models.Activity);
    }
  }
  Discussion.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ActivityId: DataTypes.UUIDV4,
      topic: DataTypes.STRING,
      speaker: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Discussion",
    }
  );
  return Discussion;
};
