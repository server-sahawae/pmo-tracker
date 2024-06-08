const { Op, where } = require("sequelize");
const { sequelize, Sequelize } = require("../models");
const {
  UserPartnerProgramProjectActivity: Assignment,
  User,
  Partner,
  UserUserLevel,
} = require("../models");
const { KADIN_ONLY, DATA_NOT_FOUND } = require("../constants/ErrorKeys");
const moment = require("moment");
const { kadinIndonesia, expireRedis } = require("../constants/staticValue");
const { redisPMO } = require("../config/redis");
const { deleteRedisKeys } = require("../helpers/redis");
const { v4 } = require("uuid");
module.exports = class Controller {
  static async createAssignmentPartner(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id: createdBy } = req.access;
      console.log("================================");
      console.log({ createdBy });
      console.log("================================");
      const { UserId, PartnerId, UserLevelId } = req.body;
      await Assignment.create(
        { UserId, PartnerId, createdBy },
        { transaction: t }
      );

      const [find, create] = await UserUserLevel.findOrCreate({
        where: { UserLevelId, UserId },
        defaults: { createdBy },
      });
      console.log(find);
      console.log(create);

      const user = await User.findOne({
        where: { id: UserId },
        attributes: ["name"],
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
          } to ${partner && partner.dataValues.name}`
        );
    } catch (error) {
      await t.rollback();

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
};
