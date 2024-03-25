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
      ProgramId: {
        type: Sequelize.UUID,
        references: { model: "Programs" },
      },
      ProjectId: {
        type: Sequelize.UUID,
        references: { model: "Projects" },
      },
      ProgramIndicatorId: {
        type: Sequelize.UUID,
        references: { model: "ProgramIndicators" },
      },
      deletedAt: {
        type: Sequelize.DATE,
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
