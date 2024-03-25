"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const data = require("../data/Projects.json").map((el) => {
        return {
          ...el,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
      // console.log(data.length);
      await queryInterface.bulkInsert(
        "Projects",
        data.filter((el) => !el.deletedAt),
        {}
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Projects", null);
  },
};
