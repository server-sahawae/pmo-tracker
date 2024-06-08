const { NO_AUTHORIZE } = require("../constants/ErrorKeys");
const { verifyToken } = require("../helpers/jwt");
const { User, UserUserLevel } = require("../models");

const getUserFromAccessToken = async (req, res, next) => {
  try {
    const { access_token, userlevelid: UserLevelId } = req.headers;
    if (!access_token) throw { name: UNAUTHORIZED };

    const result = verifyToken(access_token);
    console.log(result);
    console.log(result);
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
    req.access = { id: result.id, payload: result.payload };
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = { getUserFromAccessToken };
