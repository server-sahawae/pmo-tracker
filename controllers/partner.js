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

  static async searchPartners(req, res, next) {
    try {
      const { search } = req.query;
      const { page = 1, size = 10 } = req.query;

      const limit = parseInt(size);
      const offset = (page - 1) * limit;

      console.log(search);
      const redisCheck = await redisPMO.get(
        `findAllPartnersPage${page}:Size${limit}:${search}`
      );
      if (!redisCheck) {
        let options = {};
        if (search) {
          options = {
            [Op.or]: [
              {
                name: { [Op.like]: `%${search}%` },
              },
              {
                chief: { [Op.like]: `%${search}%` },
              },
            ],
          };
        }

        const result = await Partner.findAndCountAll({
          where: options,
          attributes: ["id", "name", "chief"],
          limit: limit,
          offset: offset,
          order: [
            ["name", "ASC"], // Then sort by name ascending
            ["chief", "ASC"], // Finally, sort by email for null names
          ],
        });

        const totalPages = Math.ceil(result.count / limit);

        const partnersWithRecordNumber = result.rows.map((partner, index) => ({
          ...partner.toJSON(),
          recordNumber: offset + index + 1,
        }));
        await redisPMO.set(
          `findAllPartnersPage${page}:Size${limit}:${search}`,
          JSON.stringify(
            {
              firstRecordInPage: (Number(page) - 1) * size + 1,
              lastRecordInPage:
                Number(page) * size - 1 > result.count
                  ? result.count
                  : Number(page) * size - 1,
              totalItems: result.count,
              totalPages: totalPages,
              currentPage: Number(page),
              partners: partnersWithRecordNumber,
            },
            null,
            2
          ),
          { EX: expireRedis }
        );

        res.status(200).json({
          firstRecordInPage: (Number(page) - 1) * size + 1,
          lastRecordInPage:
            Number(page) * size - 1 > result.count
              ? result.count
              : Number(page) * size - 1,
          totalItems: result.count,
          totalPages: totalPages,
          currentPage: Number(page),
          partners: partnersWithRecordNumber,
        });
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
