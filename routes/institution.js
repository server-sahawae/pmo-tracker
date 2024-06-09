const {
  createInstitution,
  findAllInstitutions,
  institutionProgramReport,
  institutionSinergy,
} = require("../controllers/institution");

const routes = require("express").Router();

routes.get("/", findAllInstitutions);
routes.get("/sinergy", institutionSinergy);
routes.get("/recap/:InstitutionId", institutionProgramReport);
routes.post("/create", createInstitution);

module.exports = routes;
