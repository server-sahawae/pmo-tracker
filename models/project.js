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
      Project.hasMany(models.ProjectRundown);
      Project.belongsTo(models.Category);
      Project.belongsToMany(models.Partner, { through: models.PartnerProject });
      Project.hasMany(models.Activity);
      Project.hasMany(models.PartnerProject);
      Project.belongsToMany(models.ProgramIndicator, {
        through: models.ProjectProgramIndicator,
      });
    }
  }
  Project.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      CategoryId: DataTypes.UUIDV4,
      folderUrl: DataTypes.STRING,
      title: DataTypes.STRING,
      location: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      background: DataTypes.TEXT,

      image: DataTypes.BLOB("medium"),
      createdBy: { type: DataTypes.UUIDV4, references: "Users" },
      updatedBy: { type: DataTypes.UUIDV4, references: "Users" },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
