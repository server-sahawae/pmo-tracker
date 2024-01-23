const { Op } = require("sequelize");
const { UNAUTHORIZED, BAD_REQUEST } = require("../constants/ErrorKeys");
const { Priority } = require("../models");
const { redisSearch } = require("../config/redis");

module.exports = class Controller {
  static async searchAllPriority(req, res, next) {
    try {
      const { search } = req.params;
      console.log(search);
      const redisCheck = await redisSearch.get(`SearchAllPriorities:${search}`);
      if (!redisCheck) {
        const result = await Priority.findAll({
          where: {
            [Op.or]: {
              name: { [Op.like]: `%${search}%` },
              keyword: { [Op.like]: `%${search}%` },
            },
          },
          order: [["name", "ASC"]],
        });
        await redisSearch.set(
          `SearchAllPriorities:${search}`,
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

  static async searchPriorityById(req, res, next) {
    try {
      const { search } = req.params;
      console.log(search);
      const redisCheck = await redisSearch.get(`PriorityId:${search}`);
      if (!redisCheck) {
        const result = await Priority.findOne({
          where: {
            id: search,
          },
          order: [["name", "ASC"]],
        });
        await redisSearch.set(
          `PriorityId:${search}`,
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
