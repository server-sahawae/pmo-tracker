"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4 } = require("uuid");
    const data = require("../data/partners.json").map((el) => {
      return {
        ...el,
        InstitutionId: "14a870b2-6f40-4120-9c3f-2d7c2379442d",
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
