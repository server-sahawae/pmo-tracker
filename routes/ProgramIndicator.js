const {
  findAllIndicator,
  indicatorById,
} = require("../controllers/ProgramIndicator");

const routes = require("express").Router();

routes.get("/", findAllIndicator);
routes.get("/:id", indicatorById);

module.exports = routes;
