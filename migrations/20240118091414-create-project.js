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
      // flyer: {
      //   type: Sequelize.BOOLEAN,
      // },
      // photo: {
      //   type: Sequelize.BOOLEAN,
      // },
      // video: {
      //   type: Sequelize.BOOLEAN,
      // },
      // release: {
      //   type: Sequelize.BOOLEAN,
      // },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Projects");
  },
};
