const { Op, transaction } = require("sequelize");
const { UNAUTHORIZED, BAD_REQUEST } = require("../constants/ErrorKeys");
const { PartnerPosition, User, Partner, Position } = require("../models");
const { redisSearch } = require("../config/redis");
const { expireRedis } = require("../constants/staticValue");

module.exports = class Controller {
  static async createPartnerPosition(req, res, next) {
    try {
      const { name, PartnerId } = req.body;
      const t = await transaction;
      const [PartnerPosition, created] = await PartnerPosition.findOrCreate({
        where: { name },
        defaults: { PartnerId },
        transaction: t,
      });
      res.status(200).json(PartnerPosition);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async searchAllPartnerPositions(req, res, next) {
    try {
      const { PartnerId } = req.params;
      const { search } = req.query;
      console.log(PartnerId, search);
      const redisCheck = await redisSearch.get(
        `PartnerId:${PartnerId}:SearchAllPartnerPosition:${search}`
      );
      if (!redisCheck) {
        const result = await PartnerPosition.findAll({
          where: {
            PartnerId,
          },
          include: [
            { model: Partner },
            { model: Position, where: { name: { [Op.like]: `%${search}%` } } },
          ],
          // order: [["name", "ASC"]],
        });
        // const result = await Position.findAll({
        //   where: {
        //     name: { [Op.like]: `%${search}%` },
        //   },
        //   include: [{ model: Partner, where: { id: PartnerId } }],
        //   order: [["name", "ASC"]],
        // });
        await redisSearch.set(
          `PartnerId:${PartnerId}:SearchAllPartnerPosition:${search}`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
        );
        console.log(result);
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async searchPartnerPositionById(req, res, next) {
    try {
      const { search } = req.params;
      const redisCheck = await redisSearch.get(`PartnerPositionId:${search}`);
      if (!redisCheck) {
        const result = await PartnerPosition.findOne({
          where: {
            id: search,
          },
          order: [["name", "ASC"]],
        });
        await redisSearch.set(
          `PartnerPositionId:${search}`,
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
