"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectInvitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectInvitation.belongsTo(models.Project);
      ProjectInvitation.belongsTo(models.User);
    }
  }
  ProjectInvitation.init(
    {
      ProjectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProjectInvitation",
    }
  );
  return ProjectInvitation;
};
