"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Projects", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      CategoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Categories" },
      },
      folderUrl: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      background: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.BLOB("medium"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users" },
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users" },
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Projects");
  },
};
