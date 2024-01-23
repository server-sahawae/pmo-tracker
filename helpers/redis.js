const { redisPMO } = require("../config/redis");

const deleteRedisKeys = async (keys) => {
  try {
    // console.log(keys);
    const redKeys = await redisPMO.keys("*");

    for (let i = 0; i < redKeys.length; i++) {
      if (redKeys[i].includes(keys)) {
        await redisPMO.del(redKeys[i]);
        console.log(`deleted with Key: ${redKeys[i]}`);
        continue;
      }
      const keyValue = await redisPMO.get(redKeys[i]);
      if (keyValue.includes(keys)) {
        console.log(`deleted with Value: ${redKeys[i]}`);
        await redisPMO.del(redKeys[i]);
        continue;
      }
      console.log(`Pass: ${redKeys[i]}`);
    }
  } catch (error) {
    throw error;
  }
};
module.exports = { deleteRedisKeys };
