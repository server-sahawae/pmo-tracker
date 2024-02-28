const {
  createInstitution,
  findAllInstitutions,
} = require("../controllers/institution");

const routes = require("express").Router();

routes.get("/", findAllInstitutions);
routes.post("/create", createInstitution);

module.exports = routes;
