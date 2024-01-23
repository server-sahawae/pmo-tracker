"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "ProgramCommittees",
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
        CommitteeId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "Committees" },
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
          ["Program Committee"]: {
            fields: ["ProgramId", "CommitteeId", "deletedAt"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProgramCommittees");
  },
};
