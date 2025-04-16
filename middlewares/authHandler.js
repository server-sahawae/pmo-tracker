const { Op } = require("sequelize");
const { NO_AUTHORIZE, UNAUTHORIZED } = require("../constants/ErrorKeys");
const { verifyToken } = require("../helpers/jwt");
const { User, UserUserLevel } = require("../models");
const { redisPMO } = require("../config/redis");

const getUserFromAccessToken = async (req, res, next) => {
  try {
    const { access_token, userlevelid: UserLevelId } = req.headers;
    if (!access_token) throw { name: UNAUTHORIZED };

    const redisCheck = await redisPMO.get(access_token);
    if (!redisCheck) {
      const result = verifyToken(access_token);

      const auth = JSON.parse(
        JSON.stringify(
          await UserUserLevel.findOne({
            where: {
              [Op.and]: [
                {
                  UserLevelId,
                },
                { UserId: result.id },
              ],
            },
            include: { model: User, attributes: ["name", "email", "picture"] },
          })
        )
      );

      if (!auth) throw { name: NO_AUTHORIZE };
      req.access = {
        id: auth.UserId,
        UserLevelId: auth.UserLevelId,
        name: auth.User.name,
        email: auth.User.email,
        picture: auth.User.picture,
      };

      await redisPMO.set(access_token, JSON.stringify(req.access, null, 2));
    } else req.access = JSON.parse(redisCheck);

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const adminPass = async (req, res, next) => {
  try {
    const { id: createdBy, UserLevelId: CreatorLevelId } = req.access;
    if (CreatorLevelId != "6d06f116-f3e5-4dcf-84dd-8e8ae053e922")
      throw { name: NO_AUTHORIZE };
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = { getUserFromAccessToken, adminPass };
