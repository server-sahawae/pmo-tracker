"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Programs",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          onDelete: "cascade",
          onUpdate: "cascade",
        },
        PartnerId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "Partners" },
        },
        name: {
          type: Sequelize.STRING,
        },
        rapimnas: { type: Sequelize.BOOLEAN },
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
          ["Program name"]: {
            fields: ["PartnerId", "name"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Programs");
  },
};
