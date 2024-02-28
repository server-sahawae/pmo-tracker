const {
  createProgram,
  programsByDepartmentId,

  programDetail,
  deleteProgram,
} = require("../controllers/program");

const routes = require("express").Router();

routes.get("/department/:id", programsByDepartmentId);
routes.post("/", createProgram);
routes.get("/:id", programDetail);
routes.delete("/:ProgramId", deleteProgram);

module.exports = routes;
