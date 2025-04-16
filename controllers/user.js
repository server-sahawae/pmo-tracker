const { Op, literal } = require("sequelize");
const {
  BAD_REQUEST,
  NO_AUTHORIZE,
  DATA_NOT_FOUND,
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
const { createToken, verifyToken } = require("../helpers/jwt");

module.exports = class Controller {
  static async createUser(req, res, next) {
    try {
      const { email, UserLevelId } = req.body;
      //   await Role.create({ name: "test", level: 1 });

      const checkUser = await User.findOne({
        where: { email },
        attributes: ["id", "name", "email", "deletedAt"],
        paranoid: false,
      });
      const checkUserLevel = await UserLevel.findOne({
        where: { id: UserLevelId },
        attributes: ["name"],
      });
      if (!checkUserLevel)
        throw {
          response: { data: { message: "User privileges are not available" } },
        };

      if (checkUser) {
        if (checkUser.deletedAt) {
          await User.restore({ where: { email } });
        }

        console.log(checkUser.id);
        await UserUserLevel.create({
          UserId: checkUser.id,
          createdBy: req.access.id,
          UserLevelId,
        });

        res
          .status(200)
          .json(
            `${
              checkUser.name ? checkUser.name : checkUser.email
            } is now assigned as ${checkUserLevel.name}`
          );
      } else {
        const [user, created] = await User.findOrCreate({
          where: { email },
          defaults: {
            createdBy: req.access.id,
          },
        });
        console.log(
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );
        console.log({ UserId: user.id, UserLevelId });
        console.log(
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );
        if (created)
          await UserUserLevel.create({
            UserId: user.id,
            UserLevelId,
            createdBy: req.access.id,
          });

        res
          .status(200)
          .json(
            `${user.name ? user.name : user.email} is now assigned as ${
              checkUserLevel.name
            }`
          );
      }
      // if (created) {
      //   res.status(200).json(`User has been created with email: ${user.email}`);
      // } else throw { name: BAD_REQUEST };
    } catch (error) {
      // console.log(Object.keys(error));
      if (error.errors[0].message == "Privileges must be unique")
        next({
          response: { data: { message: "This user already assigned" } },
        });
      next(error);
    }
  }

  static async deleteUserByUserId(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      const result = await User.findOne({
        where: { id },
      });
      if (!result) throw { name: DATA_NOT_FOUND };
      await User.destroy({
        where: { id },
      });

      await UserUserLevel.destroy({
        where: { UserId: id },
      });

      res
        .status(200)
        .json(`${result.name ? result.name : result.email} has been deleted!`);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const { search } = req.query;
      const { page = 1, size = 10 } = req.query;

      const limit = parseInt(size);
      const offset = (page - 1) * limit;

      const redisCheck = await redisPMO.get(
        `findAllUserPage${page}:Size${limit}:${search}`
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
                email: { [Op.like]: `%${search}%` },
              },
              {
                phone: { [Op.like]: `%${search}%` },
              },
            ],
          };
        }

        const result = await User.findAndCountAll({
          where: options,
          attributes: ["id", "name", "email"],
          limit: limit,
          offset: offset,
          order: [
            ["name", "ASC"], // Then sort by name ascending
            ["email", "ASC"], // Finally, sort by email for null names
          ],
        });

        const totalPages = Math.ceil(result.count / limit);

        const usersWithRecordNumber = result.rows.map((user, index) => ({
          ...user.toJSON(),
          recordNumber: offset + index + 1,
        }));

        const finalResult = {
          firstRecordInPage: (Number(page) - 1) * size + 1,
          lastRecordInPage:
            Number(page) * size - 1 > result.count
              ? result.count
              : Number(page) * size - 1,
          totalItems: result.count,
          totalPages: totalPages,
          currentPage: Number(page),
          users: usersWithRecordNumber,
        };
        await redisPMO.set(
          `findAllUserPage${page}:Size${limit}:${search}`,
          JSON.stringify(finalResult, null, 2),
          { EX: expireRedis }
        );

        res.status(200).json(finalResult);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getUserLevelById(req, res, next) {
    try {
      const { UserId } = req.params;

      const redisCheck = await redisPMO.get(`getUserLevelById:${UserId}`);
      if (!redisCheck) {
        const result = await UserUserLevel.findAll({
          where: { UserId },
          attributes: ["id"],
          include: { model: UserLevel, attributes: ["name"] },
        });

        await redisPMO.set(
          `getUserLevelById:${UserId}`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
        );

        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      next(error);
    }
  }

  static async getUserLevelList(req, res, next) {
    try {
      const result = await UserLevel.findAll({
        attributes: ["id", "name"],
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserLevelByUserLevelId(req, res, next) {
    try {
      const { UserLevelId } = req.params;
      const result = await UserUserLevel.findOne({
        attributes: ["id"],
        where: { id: UserLevelId },
        include: [
          {
            attributes: ["name"],
            model: UserLevel,
          },
          {
            attributes: ["name", "email"],
            model: User,
          },
        ],
      });
      const deletedUser = await UserUserLevel.destroy({
        where: { id: UserLevelId },
      });
      console.log(deletedUser);
      if (!deletedUser) throw { name: DATA_NOT_FOUND };
      res
        .status(200)
        .json(
          `${result.User.name ? result.User.name : result.User.email} as ${
            result.UserLevel.name
          } has been deleted!`
        );
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
      delete req.access.id;
      res.status(200).json(req.access);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      console.log("=================== login =================");

      const { credential, userlevelid: UserLevelId } = req.headers;
      console.log(req.headers);

      if (!credential) throw { name: NO_AUTHORIZE };
      const result = await verifyGoogleAuth(credential);
      console.log(result.payload);
      const auth = JSON.parse(
        JSON.stringify(
          await UserUserLevel.findOne({
            where: {
              UserLevelId,
            },
            include: { model: User, where: { email: result.payload.email } },
          })
        )
      );
      if (!auth) throw { name: NO_AUTHORIZE };
      await User.update(
        {
          name: result.payload.name,
          picture: result.payload.picture,
        },
        { where: { id: auth.User.id } }
      );

      const access_token = createToken({ id: auth.User.id });
      res.status(200).json({
        name: auth.User.name,
        access_token,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
