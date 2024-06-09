const {
  createActivity,
  deleteActivity,
  findAllActivitiesByProjectId,
  findAllNonProjectActivitiesByPartnerId,
  findAllActivitiesByInstitutionId,
} = require("../controllers/activity");
const { getUserFromAccessToken } = require("../middlewares/authHandler");

const routes = require("express").Router();

routes.post("/", getUserFromAccessToken, createActivity);
routes.delete("/:ActivityId", deleteActivity);
routes.get("/project/:ProjectId", findAllActivitiesByProjectId);
routes.get("/institution/:InstitutionId", findAllActivitiesByInstitutionId);
routes.get("/nonproject/:PartnerId", findAllNonProjectActivitiesByPartnerId);

module.exports = routes;
