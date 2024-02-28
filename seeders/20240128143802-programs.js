"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/Programs.json").map((el) => {
      return {
        ...el,
        rapimnas: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // console.log(data.length);
    await queryInterface.bulkInsert(
      "Programs",
      data.filter((el) => !el.deletedAt),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Programs", null);
  },
};
