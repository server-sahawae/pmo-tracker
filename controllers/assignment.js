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
      const {
        email,
        PartnerId,
        UserLevelId = "72372ccb-a973-4413-8d8f-2ffda25b7858",
      } = req.body;

      const [findUser, createUser] = await User.findOrCreate({
        where: { email },
        transaction: t,
      });

      await Assignment.create(
        { UserId: findUser.id, PartnerId, createdBy },
        { transaction: t }
      );

      const [find, create] = await UserUserLevel.findOrCreate({
        where: { UserLevelId, UserId: findUser.id },
        defaults: { createdBy },
        transaction: t,
      });
      console.log(find);
      console.log(create);

      const user = await User.findOne({
        where: { id: findUser.id },
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
