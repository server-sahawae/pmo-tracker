if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME_DEV,
    host: "148.135.136.55",
    dialect: "postgres",
    // port: 3306,
    timezone: "+07:00",
  },
  test: {
    username: "root",
    password: null,
    database: "WebElements_test",
    host: "127.0.0.1",
    dialect: "postgres",
    dialectOptions: {
      " useUTC": false,
    },
    timezone: "+07:00",
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: "217.21.72.148",
    dialect: "postgres",

    timezone: "+07:00",
  },
};
