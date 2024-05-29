const { Op, transaction, or } = require("sequelize");
const { UNAUTHORIZED, BAD_REQUEST } = require("../constants/ErrorKeys");
const { Partner, Institution } = require("../models");
const { redisSearch, redisPMO } = require("../config/redis");
const { expireRedis } = require("../constants/staticValue");

module.exports = class Controller {
  static async createPartner(req, res, next) {
    try {
      const { name, InstitutionId, chief } = req.body;
      console.log(chief);
      const t = await transaction;
      const [partner, created] = await Partner.findOrCreate({
        where: { name },
        defaults: { InstitutionId, chief },
        transaction: t,
      });
      res.status(200).json(partner);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async searchAllPartners(req, res, next) {
    try {
      const { search } = req.params;
      console.log(search);
      const redisCheck = await redisSearch.get(`SearchAllPartner:${search}`);
      if (!redisCheck) {
        const result = await Partner.findAll({
          where: {
            [Op.or]: {
              name: { [Op.like]: `%${search}%` },
              chief: { [Op.like]: `%${search}%` },
            },
          },
          include: Institution,
          order: [
            ["no", "ASC"],
            ["name", "ASC"],
          ],
          limit: 20,
        });
        await redisSearch.set(
          `SearchAllPartner:${search}`,
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

  static async findAllPartnersByInstitutionId(req, res, next) {
    try {
      const { InstitutionId } = req.params;
      // console.log(req.headers);
      console.log(InstitutionId);
      const redisCheck = await redisPMO.get(
        `FindAllPartnerByInstitutionId:${InstitutionId}`
      );
      if (!redisCheck) {
        const result = await Partner.findAll({
          where: {
            InstitutionId,
          },
          include: Institution,
          order: [
            ["no", "ASC"],
            ["name", "ASC"],
          ],
        });
        await redisPMO.set(
          `FindAllPartnerByInstitutionId:${InstitutionId}`,
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

  static async searchPartnerById(req, res, next) {
    try {
      const { search } = req.params;
      console.log(search);
      const redisCheck = await redisSearch.get(`PartnerId:${search}`);
      if (!redisCheck) {
        const result = await Partner.findOne({
          where: {
            id: search,
          },
          include: [Institution],
          order: [
            ["no", "ASC"],
            ["name", "ASC"],
          ],
        });
        await redisSearch.set(
          `PartnerId:${search}`,
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
