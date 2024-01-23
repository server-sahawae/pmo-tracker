const { Op } = require("sequelize");
const { UNAUTHORIZED, BAD_REQUEST } = require("../constants/ErrorKeys");
const { hash, compareHash } = require("../helpers/bcrypt");
const { createToken, verifyToken } = require("../helpers/jwt");
const { loggerInfo } = require("../helpers/loggerDebug");
const { User, Partner, Institution, UserLevel } = require("../models");
const { redisSearch, redisPMO } = require("../config/redis");

module.exports = class Controller {
  static async createUser(req, res, next) {
    try {
      const { name, email, phone } = req.body;
      //   await Role.create({ name: "test", level: 1 });
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          level: 1,
        },
      });
      if (created) {
        res.status(200).json(user.name);
      } else throw { name: BAD_REQUEST };
    } catch (error) {
      next(error);
    }
  }

  static async searchAllUsers(req, res, next) {
    try {
      const { search } = req.params;
      console.log(search);
      const redisCheck = await redisSearch.get(`SearchAllUsers:${search}`);
      if (!redisCheck) {
        const result = await User.findAll({
          where: {
            [Op.or]: {
              name: { [Op.like]: `%${search}%` },
            },
          },
          include: {
            attributes: ["id", "name"],
            model: Partner,
            order: [["name", "ASC"]],
          },

          order: [["name", "ASC"]],
        });
        await redisSearch.set(
          `SearchAllUsers:${search}`,
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

  static async searchUserById(req, res, next) {
    try {
      const { id } = req.params;
      const redisCheck = await redisPMO.get(`User:${id}`);
      if (!redisCheck) {
        const result = await User.findOne({
          attributes: ["id", "name", "position", "picture"],
          where: {
            id,
          },
          include: [
            {
              attributes: ["id", "name"],
              model: Partner,
              include: {
                model: Institution,
                attributes: ["id", "name"],
              },
            },
            {
              attributes: ["id", "name"],
              model: UserLevel,
            },
          ],
        });
        await redisPMO.set(`User:${id}`, JSON.stringify(result, null, 2), {
          EX: 60 * 60 * 24,
        });
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async searchAllInvitedUsersByProjectId(req, res, next) {
    try {
      const { ProjectId } = req.params;
      const redisCheck = await redisPMO.get(`InvitedUser:${ProjectId}`);
      if (!redisCheck) {
        const result = await Institution.findAll({
          attributes: ["id", "name", "position", "picture"],
          include: [
            {
              attributes: ["id", "name"],
              model: Partner,
              include: {
                model: User,
                attributes: ["id", "name", "position"],
                where: { ProjectId },
              },
            },
            {
              attributes: ["id", "name"],
              model: UserLevel,
            },
          ],
        });
        await redisPMO.set(`User:${id}`, JSON.stringify(result, null, 2), {
          EX: 60 * 60 * 24,
        });
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
