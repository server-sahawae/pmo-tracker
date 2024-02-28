const {
  searchAllIndicator,
  findAllIndicatorFromManyPrograms,
} = require("../controllers/indicator");

const routes = require("express").Router();

routes.get("/", findAllIndicatorFromManyPrograms);
routes.get("/:ProgramId", searchAllIndicator);

module.exports = routes;
