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
      Project.hasMany(models.PartnerProjectActivity);
      Project.hasMany(models.ProjectProgramIndicator);
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
      title: DataTypes.STRING,
      location: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      background: DataTypes.TEXT,
      // flyer: DataTypes.BOOLEAN,
      // photo: DataTypes.BOOLEAN,
      // video: DataTypes.BOOLEAN,
      // release: DataTypes.BOOLEAN,
      status: DataTypes.INTEGER,
      image: DataTypes.BLOB("medium"),
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
