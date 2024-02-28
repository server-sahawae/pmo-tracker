const {
  findAllIndicator,
  inducatorById,
} = require("../controllers/ProgramIndicator");

const routes = require("express").Router();

routes.get("/", findAllIndicator);
routes.get("/:id", inducatorById);

module.exports = routes;
