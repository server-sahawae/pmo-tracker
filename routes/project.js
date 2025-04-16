const {
  createProject,
  findAllProjectsByProgramId,
  findAllProjectsWithoutProgram,
  uploadImage,
  ProjectImage,
  findProjectById,
  deleteProject,
  projectScore,
} = require("../controllers/project");
const {
  getUserFromAccessToken,
  adminPass,
} = require("../middlewares/authHandler");
const { deleteRedisKeys } = require("../middlewares/redis");
const routes = require("express").Router();

routes.post(
  "/",
  deleteRedisKeys,
  getUserFromAccessToken,

  createProject
);
routes.get("/image/:ProjectId", ProjectImage);
routes.post(
  "/image/:id",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  uploadImage
);
routes.get("/program/:ProgramId", findAllProjectsByProgramId);
routes.get("/non/:PartnerId", findAllProjectsWithoutProgram);
routes.get("/scores/:ProjectId", projectScore);
routes.get("/:ProjectId", findProjectById);
routes.delete(
  "/:ProjectId",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  deleteProject
);

module.exports = routes;
