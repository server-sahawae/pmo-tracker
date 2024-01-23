const { Op } = require("sequelize");
const { ProgramIndicator } = require("../models");
const { redisSearch } = require("../config/redis");

module.exports = class Controller {
  static async searchAllIndicator(req, res, next) {
    try {
      const { ProgramId } = req.params;
      const redisCheck = await redisSearch.get(`SearchProgram:${ProgramId}`);
      if (!redisCheck) {
        const result = await ProgramIndicator.findAll({
          where: {
            [Op.or]: {
              ProgramId: { [Op.like]: `%${ProgramId}%` },
            },
          },
        });
        await redisSearch.set(
          `SearchProgram:${ProgramId}`,
          JSON.stringify(result, null, 2),
          { EX: 60 * 60 * 24 }
        );
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
