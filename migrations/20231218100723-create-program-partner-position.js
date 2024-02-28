"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "ProgramPartnerPositions",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        ProgramId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "Programs" },
        },
        PartnerPositionId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "PartnerPositions" },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          ["Program PartnerPosition"]: {
            fields: ["ProgramId", "PartnerPositionId"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProgramPartnerPositions");
  },
};
