const {
  createActivity,
  deleteActivity,
  findAllActivitiesByProjectId,
  findAllNonProjectActivitiesByPartnerId,
  findAllActivitiesByInstitutionId,
  recapActivites,
} = require("../controllers/activity");
const { getUserFromAccessToken } = require("../middlewares/authHandler");
const { deleteRedisKeys } = require("../middlewares/redis");
const routes = require("express").Router();

routes.post("/", deleteRedisKeys, getUserFromAccessToken, createActivity);
routes.delete("/:ActivityId", deleteRedisKeys, deleteActivity);
routes.get("/recap", recapActivites);
routes.get("/project/:ProjectId", findAllActivitiesByProjectId);
routes.get("/institution/:InstitutionId", findAllActivitiesByInstitutionId);
routes.get("/nonproject/:PartnerId", findAllNonProjectActivitiesByPartnerId);

module.exports = routes;
