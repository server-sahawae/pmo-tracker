"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // console.log(data.length);
      await queryInterface.bulkInsert(
        "Projects",
        require("../data/Projects.json")
          .map((el) => {
            delete el.status;

            return {
              ...el,
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
              updatedBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
            };
          })
          .filter((el) => !el.deletedAt),
        {}
      );
      await queryInterface.bulkInsert(
        "Projects",
        require("../data/projects/Projects.json")
          .map((el) => {
            delete el.status;
            return {
              ...el,
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
              updatedBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
            };
          })
          .filter((el) => !el.deletedAt),
        {}
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Projects", null);
  },
};
