"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/kadinprov.json").map((el) => {
      return {
        ...el,
        InstitutionId: "5c253493-1e16-4d55-a5e6-afdba8cd3833",
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
