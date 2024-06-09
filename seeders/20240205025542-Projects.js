"use strict";

/** @type {import('sequelize-cli').Migration} */

const moment = require("moment");

module.exports = {
  async up(queryInterface, Sequelize) {
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
          console.log({
            ...el,
            end: moment(el.end).format("YYYY-MM-DD HH:mm:ss"),
            start: moment(el.start).format("YYYY-MM-DD HH:mm:ss"),
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
            updatedBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
          });
          return {
            ...el,
            end: moment(el.end).format("YYYY-MM-DD HH:mm:ss"),
            start: moment(el.start).format("YYYY-MM-DD HH:mm:ss"),
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
            updatedBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
          };
        })
        .filter((el) => !el.deletedAt)
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Projects", null);
  },
};
