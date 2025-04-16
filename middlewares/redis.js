const { redisPMO, redisSearch } = require("../config/redis");

const deleteRedisKeys = async (req, res, next) => {
  try {
    await redisPMO.flushAll();
    await redisSearch.flushAll();
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = { deleteRedisKeys };
