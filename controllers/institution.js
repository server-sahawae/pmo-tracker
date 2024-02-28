const { Op, transaction } = require("sequelize");
const { UNAUTHORIZED, BAD_REQUEST } = require("../constants/ErrorKeys");
const { hash, compareHash } = require("../helpers/bcrypt");
const { createToken, verifyToken } = require("../helpers/jwt");
const { loggerInfo } = require("../helpers/loggerDebug");
const { Institution } = require("../models");
const { redisSearch } = require("../config/redis");
const { expireRedis } = require("../constants/staticValue");

module.exports = class Controller {
  static async createInstitution(req, res, next) {
    try {
      const { name } = req.body;
      const t = await transaction;
      const result = await Institution.findOrCreate({
        where: { name },
        defaults: {},
        transaction: t,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async findAllInstitutions(req, res, next) {
    try {
      const redisCheck = await redisSearch.get(`AllInstitutions`);
      if (!redisCheck) {
        const result = await Institution.findAll();
        await redisSearch.set(
          `AllInstitutions`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
        );
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
