const {
  createInstitution,
  findAllInstitutions,
  institutionProgramReport,
  institutionSinergy,
} = require("../controllers/institution");
const { deleteRedisKeys } = require("../middlewares/redis");

const routes = require("express").Router();

routes.get("/", findAllInstitutions);
routes.get("/sinergy", institutionSinergy);
routes.get("/recap/:InstitutionId", institutionProgramReport);
routes.post("/create", deleteRedisKeys, createInstitution);

module.exports = routes;
