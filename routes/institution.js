const { createInstitution } = require("../controllers/institution");

const routes = require("express").Router();

routes.post("/create", createInstitution);

module.exports = routes;
