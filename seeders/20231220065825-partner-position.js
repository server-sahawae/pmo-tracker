"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/PartnerPositions.json").map((el) => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // console.log(data);
    await queryInterface.bulkInsert("PartnerPositions", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("PartnerPositions", null);
  },
};
