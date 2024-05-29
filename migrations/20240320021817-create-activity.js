"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Activities", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      CategoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Categories" },
      },

      PartnerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Partners" },
      },

      ProjectId: {
        type: Sequelize.UUID,
        references: { model: "Projects" },
      },
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      summary: {
        type: Sequelize.TEXT,
      },
      isMain: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      flyer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      photo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      video: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      release: {
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
    await queryInterface.dropTable("Activities");
  },
};
