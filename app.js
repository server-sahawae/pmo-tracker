if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const ErrorHandler = require("./middlewares/ErrorHandler");
const routes = require("./routes");
const app = express();
const fileupload = require("express-fileupload");
const port = process.env.PORT || 3000;
const cors = require("cors");
const { loggerInfo } = require("./helpers/loggerDebug");
const { redisPMO, redisSearch } = require("./config/redis");

app.use(fileupload());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true, limit: 10485760 }));
app.use(express.json());

app.use(routes);

app.use(ErrorHandler);
app.listen(port, async () => {
  // await redisPMO.disconnect();

  // await redisPMO.ping();
  // await redisPMO.disconnect();
  await redisPMO.connect();
  await redisSearch.connect();

  console.log(process.env.NODE_ENV);
  if (process.env.DEBUG) {
    loggerInfo(`PMO-Tracker Server listening on port ${port}`);
  } else {
    console.log(`PMO-Tracker Server listening on port ${port}`);
  }
});
