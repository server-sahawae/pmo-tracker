const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { ProgramIndicator, Program, Partner } = require("../models");

const { redisPMO, redisSearch } = require("../config/redis");
const { deleteRedisKeys } = require("../helpers/redis");
const { expireRedis } = require("../constants/staticValue");
module.exports = class Controller {
  static async findAllIndicator(req, res, next) {
    try {
      const { ProgramList } = req.query;
      const result = await ProgramIndicator.findAll({
        where: { [Op.or]: JSON.parse(ProgramList) },
        include: Program,
      });
      console.log(result.dataValue);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async inducatorById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ProgramIndicator.findOne({
        where: { id },
        include: Program,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
