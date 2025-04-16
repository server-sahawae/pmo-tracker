const { Op, where } = require("sequelize");
const { sequelize, Sequelize } = require("../models");
const {
  UserPartnerProgramProjectActivity: Assignment,
  User,
  Partner,
  UserUserLevel,
} = require("../models");
const {
  KADIN_ONLY,
  DATA_NOT_FOUND,
  NO_AUTHORIZE,
} = require("../constants/ErrorKeys");
const moment = require("moment");
const { kadinIndonesia, expireRedis } = require("../constants/staticValue");
const { redisPMO } = require("../config/redis");
const { v4 } = require("uuid");
module.exports = class Controller {
  static async createAssignmentPartner(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id: createdBy } = req.access;

      console.log("================================");
      console.log({ createdBy });
      console.log("================================");
      const {
        UserId,
        PartnerId,
        UserLevelId = "72372ccb-a973-4413-8d8f-2ffda25b7858",
      } = req.body;

      await Assignment.create(
        { UserId, PartnerId, createdBy },
        { transaction: t }
      );

      const user = await User.findOne({
        where: { id: UserId },
        attributes: ["name", "email"],
      });
      const partner = await Partner.findOne({
        where: { id: PartnerId },
        attributes: ["name"],
      });
      await t.commit();

      res
        .status(200)
        .json(
          `Assignment created successfully for ${
            user && user.dataValues.name
              ? user.dataValues.name
              : user.dataValues.email
          } to ${partner && partner.dataValues.name}`
        );
    } catch (error) {
      await t.rollback();
      console.log(error);
      next(error);
    }
  }

  static async findPartnersByUserId(req, res, next) {
    try {
      const { UserId } = req.params;
      const redisCheck = await redisPMO.get(`findPartnersByUserId:${UserId}`);

      if (!redisCheck) {
        const result = await Assignment.findAll({
          attributes: ["id"],
          where: { UserId },
          include: {
            model: Partner,
            attributes: ["id", "name"],
            order: ["no"],
          },
        });
        await redisPMO.set(
          `findPartnersByUserId:${UserId}`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
        );
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      next(error);
    }
  }

  static async findPartners(req, res, next) {
    try {
      const { id: UserId } = req.access;
      const result = await Partner.findAll({
        attributes: ["id", "name"],
        include: {
          model: Assignment,
          attributes: [],
          where: { [Op.and]: [{ UserId }, { PartnerId: { [Op.not]: null } }] },
        },
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserAssignmentByAssignmentId(req, res, next) {
    try {
      const { AssignmentId } = req.params;
      const result = await Assignment.findOne({
        attributes: ["id"],
        where: { id: AssignmentId },
        include: [
          {
            attributes: ["name"],
            model: Partner,
          },
          {
            attributes: ["name", "email"],
            model: User,
          },
        ],
      });
      if (!result) throw { name: DATA_NOT_FOUND };

      const deletedAssignment = await Assignment.destroy({
        where: { id: AssignmentId },
      });
      if (!deletedAssignment) throw { name: DATA_NOT_FOUND };
      res
        .status(200)
        .json(
          `Assignment for ${
            result.User.name ? result.User.name : result.User.email
          } to ${result.Partner.name} has been removed!`
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
