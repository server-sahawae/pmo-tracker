const {
  searchAllPriority,
  searchPriorityById,
} = require("../controllers/priority");

const routes = require("express").Router();

routes.get("/search/:search", searchAllPriority);
routes.get("/:search", searchPriorityById);

module.exports = routes;
