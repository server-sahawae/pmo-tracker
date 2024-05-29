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

const routes = require("express").Router();

routes.post("/", createProject);
routes.get("/image/:ProjectId", ProjectImage);
routes.post("/image/:id", uploadImage);
routes.get("/program/:ProgramId", findAllProjectsByProgramId);
routes.get("/non/:PartnerId", findAllProjectsWithoutProgram);
routes.get("/scores/:ProjectId", projectScore);
routes.get("/:ProjectId", findProjectById);
routes.delete("/:ProjectId", deleteProject);

module.exports = routes;
