"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/projects/ProjectProgramIndicator.json").map(
      (el) => {
        return {
          ...el,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    );
    // console.log(data.length);
    await queryInterface.bulkInsert(
      "ProjectProgramIndicators",
      data.filter((el) => !el.deletedAt),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProjectProgramIndicators", null);
  },
};
