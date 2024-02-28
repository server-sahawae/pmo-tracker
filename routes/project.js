const { createProject } = require("../controllers/project");

const routes = require("express").Router();

routes.post("/", createProject);

module.exports = routes;
