"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/priorities.json").map((el) => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // console.log(data.length);
    await queryInterface.bulkInsert("Priorities", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Priorities", null);
  },
};
