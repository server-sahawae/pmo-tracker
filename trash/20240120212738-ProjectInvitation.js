"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/userPengurus.json")
      .slice(0, 100)
      .map((el) => {
        return {
          UserId: el.id,
          ProjectId: "6f2e8238-ac91-402f-bc09-8cd39da013b3",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
    // console.log(data.length);
    await queryInterface.bulkInsert("ProjectInvitations", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProjectInvitations", null);
  },
};
