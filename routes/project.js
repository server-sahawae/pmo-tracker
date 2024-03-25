const {
  createProject,
  findAllProjectsByProgramId,
  findAllProjectsWithoutProgram,
  uploadImage,
  ProjectImage,
  findProjectById,
  deleteProject,
} = require("../controllers/project");

const routes = require("express").Router();

routes.post("/", createProject);
routes.get("/image/:ProjectId", ProjectImage);
routes.get("/:ProjectId", findProjectById);
routes.delete("/:ProjectId", deleteProject);
routes.post("/image/:id", uploadImage);
routes.get("/program/:ProgramId", findAllProjectsByProgramId);
routes.get("/non/:PartnerId", findAllProjectsWithoutProgram);

module.exports = routes;
