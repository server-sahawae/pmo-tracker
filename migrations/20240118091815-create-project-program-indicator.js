"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProjectProgramIndicators", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      ProjectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Projects" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ProgramIndicatorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "ProgramIndicators" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProjectProgramIndicators");
  },
};
