"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectRundown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectRundown.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ProjectId: DataTypes.UUID,
      title: DataTypes.STRING,
      location: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      speaker: DataTypes.TEXT,
      note: DataTypes.TEXT,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProjectRundown",
    }
  );
  return ProjectRundown;
};
