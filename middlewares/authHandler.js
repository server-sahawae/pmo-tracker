const { NO_AUTHORIZE, UNAUTHORIZED } = require("../constants/ErrorKeys");
const { verifyToken } = require("../helpers/jwt");
const { User, UserUserLevel } = require("../models");

const getUserFromAccessToken = async (req, res, next) => {
  try {
    const { access_token, userlevelid: UserLevelId } = req.headers;
    if (!access_token) throw { name: UNAUTHORIZED };

    const result = verifyToken(access_token);

    const auth = JSON.parse(
      JSON.stringify(
        await UserUserLevel.findOne({
          where: {
            UserLevelId,
          },
          include: { model: User, where: { id: result.id } },
        })
      )
    );

    if (!auth) throw { name: NO_AUTHORIZE };
    req.access = {
      id: result.id,
      UserLevelId,
      name: auth.User.name,
      email: auth.User.email,
      picture: auth.User.picture,
    };
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
