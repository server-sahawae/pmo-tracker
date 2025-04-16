const {
  createAssignmentPartner,
  findPartnersByUserId,
  findPartners,
  deleteUserAssignmentByAssignmentId,
} = require("../controllers/assignment");
const {
  getUserFromAccessToken,
  adminPass,
} = require("../middlewares/authHandler");
const { deleteRedisKeys } = require("../middlewares/redis");
const routes = require("express").Router();
// getUserFromAccessToken;
routes.use(getUserFromAccessToken);
routes.post("/partner", deleteRedisKeys, adminPass, createAssignmentPartner);
routes.get("/partner", findPartners);
routes.get("/:UserId", findPartnersByUserId);
routes.delete(
  "/:AssignmentId",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  deleteUserAssignmentByAssignmentId
);

module.exports = routes;
