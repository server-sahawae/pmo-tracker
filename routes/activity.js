const {
  createActivity,
  deleteActivity,
  findAllActivitiesByProjectId,
  findAllNonProjectActivitiesByPartnerId,
} = require("../controllers/activity");

const routes = require("express").Router();

routes.post("/", createActivity);
routes.delete("/:ActivityId", deleteActivity);
routes.get("/project/:ProjectId", findAllActivitiesByProjectId);
routes.get("/nonproject/:PartnerId", findAllNonProjectActivitiesByPartnerId);

module.exports = routes;
