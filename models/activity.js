"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.hasMany(models.Discussion);
      Activity.belongsTo(models.Category);
      Activity.belongsTo(models.Partner);
      Activity.belongsTo(models.Project);
    }
  }
  Activity.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      location: DataTypes.STRING,
      CategoryId: DataTypes.UUIDV4,
      PartnerId: DataTypes.UUIDV4,
      ProjectId: DataTypes.UUIDV4,
      start: DataTypes.DATE,
      score: DataTypes.INTEGER,
      end: DataTypes.DATE,
      summary: DataTypes.TEXT,
      folderUrl: DataTypes.STRING,
      isMain: DataTypes.BOOLEAN,
      flyer: DataTypes.BOOLEAN,
      photo: DataTypes.BOOLEAN,
      video: DataTypes.BOOLEAN,
      release: DataTypes.BOOLEAN,
      createdBy: { type: DataTypes.UUIDV4, references: "Users" },
      updatedBy: { type: DataTypes.UUIDV4, references: "Users" },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "Activity",
    }
  );
  return Activity;
};
