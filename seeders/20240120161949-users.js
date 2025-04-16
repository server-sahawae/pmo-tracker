"use strict";

/** @type {import('sequelize-cli').Migration} */

const PartnerPositions = require("../data/PartnerPositions.json");
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/NewUser.json").map((el) => {
      // const arr = el.kta.toString().split("");
      // arr.includes("-") ? "" : arr.splice(5, 0, "-");
      // const result = arr;
      const PartnerPositionId = PartnerPositions.filter(
        (p) => p.PositionId == el.PositionId
      )[0];
      delete el.PartnerId;
      delete el.PositionId;
      delete el.kta;
      delete el.UserLevelId;

      return {
        ...el,
        // kta: result.join(""),
        PartnerPositionId: PartnerPositionId?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // console.log(data.length);
    await queryInterface.bulkInsert("Users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users");
  },
};
