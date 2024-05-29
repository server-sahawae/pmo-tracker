if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { createClient } = require("redis");

console.log("REDIS SET");
const redisPMO = createClient({
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  socket: {
    host: process.env.REDIS_PMO,
    port: 17750,
  },
});

const redisSearch = createClient({
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  socket: {
    host: process.env.REDIS_SEARCH,
    port: 12707,
  },
});

module.exports = { redisPMO, redisSearch };
