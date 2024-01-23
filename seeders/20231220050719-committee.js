"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/committees.json").map((el) => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // console.log(data);
    await queryInterface.bulkInsert("Committees", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Committees", null);
  },
};
