const { Op } = require("sequelize");
const {
  UNAUTHORIZED,
  BAD_REQUEST,
  NO_AUTHORIZE,
} = require("../constants/ErrorKeys");

const {
  User,
  Partner,
  Institution,
  UserLevel,
  PartnerPosition,
  UserUserLevel,
} = require("../models");
const { redisSearch, redisPMO } = require("../config/redis");
const { expireRedis } = require("../constants/staticValue");
const verifyGoogleAuth = require("../helpers/googleOauth");

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
      const redisCheck = await redisSearch.get(`SearchAllUsers:${search}`);
      if (!redisCheck) {
        const result = await User.findAll({
          where: {
            [Op.or]: {
              name: { [Op.like]: `%${search}%` },
            },
          },
          limit: 10,
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
          { EX: expireRedis }
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
          attributes: ["id", "name", "picture"],
          where: {
            id,
          },
          include: [
            {
              // attributes: ["id", "name"],
              model: PartnerPosition,
              include: {
                model: Partner,
                attributes: ["id", "name"],
                include: {
                  model: Institution,
                  attributes: ["id", "name"],
                },
              },
            },
            {
              attributes: ["id", "name"],
              model: UserLevel,
            },
          ],
        });
        await redisPMO.set(`User:${id}`, JSON.stringify(result, null, 2), {
          EX: expireRedis,
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
          EX: expireRedis,
        });
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async GoogleVerification(req, res, next) {
    try {
      // console.log("!!!!!!!!!!!!!!!!!!!!!!!");

      const { access_token, userlevelid: UserLevelId } = req.headers;
      if (!access_token) throw { name: UNAUTHORIZED };
      const redisCheck = await redisPMO.get(access_token);
      if (!redisCheck) {
        const result = await verifyGoogleAuth(access_token);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!");
        const auth = await UserUserLevel.findOne({
          where: {
            UserLevelId,
          },
          include: { model: User, where: { email: result.payload.email } },
        });
        // console.log(auth);
        if (!auth) throw { name: NO_AUTHORIZE };
        await redisPMO.set(
          access_token,
          JSON.stringify({ email: result.payload.email, UserId: auth.id }),
          { EXAT: result.payload.exp }
        );

        res.status(200).json(result.payload);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
