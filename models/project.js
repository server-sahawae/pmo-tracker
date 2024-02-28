"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasMany(models.ProjectInvitation);
      Project.hasMany(models.ProjectRundown);
      Project.belongsTo(models.Category);
    }
  }
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      CategoryId: DataTypes.UUID,
      title: DataTypes.STRING,
      location: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      background: DataTypes.TEXT,
      flyer: DataTypes.BOOLEAN,
      photo: DataTypes.BOOLEAN,
      video: DataTypes.BOOLEAN,
      release: DataTypes.BOOLEAN,
      status: DataTypes.INTEGER,
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
