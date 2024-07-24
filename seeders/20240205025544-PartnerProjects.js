"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "PartnerProjects",
      require("../data/PartnerProjects.json")
        .map((el) => {
          return {
            ...el,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
          };
        })
        .filter((el) => !el.deletedAt),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("PartnerProjects", null);
  },
};
