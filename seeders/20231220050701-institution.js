"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/institutions.json").map((el) => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // console.log(data);
    await queryInterface.bulkInsert("Institutions", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Institutions", null);
  },
};
