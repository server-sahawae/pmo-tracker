const {
  createAssignmentPartner,
  findPartners,
} = require("../controllers/assignment");
const { getUserFromAccessToken } = require("../middlewares/authHandler");

const routes = require("express").Router();

routes.post("/partner", getUserFromAccessToken, createAssignmentPartner);
routes.get("/partner", getUserFromAccessToken, findPartners);

module.exports = routes;
