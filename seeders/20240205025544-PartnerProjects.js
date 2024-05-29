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
          };
        })
        .filter((el) => !el.deletedAt),
      {}
    );

    await queryInterface.bulkInsert(
      "PartnerProjects",
      require("../data/projects/PartnerProject.json")
        .map((el) => {
          return {
            ...el,
            createdAt: new Date(),
            updatedAt: new Date(),
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
