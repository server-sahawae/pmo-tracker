const { searchAllIndicator } = require("../controllers/indicator");

const routes = require("express").Router();

routes.get("/:ProgramId", searchAllIndicator);

module.exports = routes;
