"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/NewUser.json").map((el) => {
      const arr = el.kta.toString().split("");
      arr.includes("-") ? "" : arr.splice(5, 0, "-");
      const result = arr;
      delete el.PartnerId;
      delete el.PositionId;
      return {
        ...el,
        kta: result.join(""),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // console.log(data.length);
    await queryInterface.bulkInsert("Users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null);
  },
};
