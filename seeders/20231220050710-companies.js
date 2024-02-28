"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/Companies.json").map((el) => {
      return {
        ...el,
        InstitutionId: "97297442-5f79-440b-9773-4814850328e9",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // console.log(data[1]);
    await queryInterface.bulkInsert("Partners", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Partners", null);
  },
};
