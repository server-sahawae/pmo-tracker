"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgramUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProgramUser.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ProgramId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      indexes: [
        {
          unique: true,
          fields: ["ProgramId", "UserId"],
        },
      ],
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProgramUser",
    }
  );
  return ProgramUser;
};
