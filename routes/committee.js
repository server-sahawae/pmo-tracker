const {
  createCommittee,
  searchAllCommittees,
  searchCommitteeById,
} = require("../controllers/committee");

const routes = require("express").Router();

routes.post("/create", createCommittee);
routes.get("/search/:search", searchAllCommittees);
routes.get("/:search", searchCommitteeById);

module.exports = routes;
