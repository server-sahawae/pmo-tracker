"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserUserLevels", {
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
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users" },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserUserLevels");
  },
};
