const { Op, transaction } = require("sequelize");
const { UNAUTHORIZED, BAD_REQUEST } = require("../constants/ErrorKeys");
const { Committee } = require("../models");
const { redisSearch } = require("../config/redis");

module.exports = class Controller {
  static async createCommittee(req, res, next) {
    try {
      const { name, PartnerId } = req.body;
      const t = await transaction;
      const [committee, created] = await Committee.findOrCreate({
        where: { name },
        defaults: { PartnerId },
        transaction: t,
      });
      res.status(200).json(committee);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async searchAllCommittees(req, res, next) {
    try {
      const { search } = req.params;
      console.log(search);
      const redisCheck = await redisSearch.get(`SearchAllCommittee:${search}`);
      if (!redisCheck) {
        const result = await Committee.findAll({
          where: {
            name: { [Op.like]: `%${search}%` },
          },
          order: [["name", "ASC"]],
        });
        await redisSearch.set(
          `SearchAllCommittee:${search}`,
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

  static async searchCommitteeById(req, res, next) {
    try {
      const { search } = req.params;
      const redisCheck = await redisSearch.get(`CommitteeId:${search}`);
      if (!redisCheck) {
        const result = await Committee.findOne({
          where: {
            id: search,
          },
          order: [["name", "ASC"]],
        });
        await redisSearch.set(
          `CommitteeId:${search}`,
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
