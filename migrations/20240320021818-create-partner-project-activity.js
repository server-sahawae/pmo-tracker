"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PartnerProjectActivities", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      PartnerId: {
        type: Sequelize.UUID,
        references: { model: "Partners" },
        allowNull: false,
      },
      ProjectId: {
        type: Sequelize.UUID,
        references: { model: "Projects" },
      },
      ActivityId: {
        type: Sequelize.UUID,
        references: { model: "Activities" },
      },
      UserId: {
        type: Sequelize.UUID,
        references: { model: "Users" },
      },
      isOwner: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("PartnerProjectActivities");
  },
};
