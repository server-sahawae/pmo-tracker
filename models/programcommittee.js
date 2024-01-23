"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgramCommittee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgramCommittee.belongsTo(models.Program, {
        onDelete: "cascade",
        foreignKey: { allowNull: false },
        hooks: true,
      });
      ProgramCommittee.belongsTo(models.Committee);
    }
  }
  ProgramCommittee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ProgramId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      CommitteeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      sequelize,
      modelName: "ProgramCommittee",
    }
  );
  return ProgramCommittee;
};
