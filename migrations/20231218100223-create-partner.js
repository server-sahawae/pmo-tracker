"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Partners",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        InstitutionId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "Institutions" },
        },
        no: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        chief: {
          type: Sequelize.STRING,
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
          actions_unique: {
            fields: ["InstitutionId", "name"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Partners");
  },
};
