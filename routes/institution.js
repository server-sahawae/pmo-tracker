const {
  createInstitution,
  findAllInstitutions,
  institutionProgramReport,
} = require("../controllers/institution");

const routes = require("express").Router();

routes.get("/", findAllInstitutions);
routes.get("/recap/:InstitutionId", institutionProgramReport);
routes.post("/create", createInstitution);

module.exports = routes;
