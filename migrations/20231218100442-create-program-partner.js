"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "ProgramPartners",
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
        PartnerId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "Partners" },
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
          ["Program partner"]: {
            fields: ["PartnerId", "ProgramId"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProgramPartners");
  },
};
