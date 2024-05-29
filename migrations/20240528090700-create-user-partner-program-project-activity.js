"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserPartnerProgramProjectActivities", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      UserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users" },
      },
      PartnerId: {
        type: Sequelize.UUID,
        references: { model: "Partners" },
      },
      ProgramId: {
        type: Sequelize.UUID,
        references: { model: "Programs" },
      },
      ProjectId: {
        type: Sequelize.UUID,
        references: { model: "Projects" },
      },
      ActivityId: {
        type: Sequelize.UUID,
        references: { model: "Activities" },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserPartnerProgramProjectActivities");
  },
};
