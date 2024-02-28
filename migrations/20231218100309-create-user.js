"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      PartnerPositionId: {
        type: Sequelize.UUID,
        references: { model: "PartnerPositions" },
      },
      kta: {
        type: Sequelize.STRING,
        // unique: true,
      },

      name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      GoogleId: {
        type: Sequelize.STRING,
      },
      picture: {
        type: Sequelize.BLOB,
      },
      UserLevelId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "UserLevels" },
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
    await queryInterface.dropTable("Users");
  },
};
