const {
  createProgram,
  programsByDepartmentId,
  programDetail,
  deleteProgram,
} = require("../controllers/program");
const {
  getUserFromAccessToken,
  adminPass,
} = require("../middlewares/authHandler");
const { deleteRedisKeys } = require("../middlewares/redis");

const routes = require("express").Router();

routes.get("/department/:id", programsByDepartmentId);
routes.post(
  "/",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  createProgram
);
routes.get("/:id", programDetail);
routes.delete(
  "/:ProgramId",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  deleteProgram
);

module.exports = routes;
