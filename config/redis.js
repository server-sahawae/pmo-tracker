if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { createClient } = require("redis");

console.log("REDIS SET");
const redisPMO = createClient({
  url: process.env.REDIS_PMO,
});

const redisSearch = createClient({
  url: process.env.REDIS_SEARCH,
});

module.exports = { redisPMO, redisSearch };
