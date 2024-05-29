const {} = require("../controllers/gdrive");

const routes = require("express").Router();

routes.get("/", (req, res, next) => res.send("GOOGLE DRIVE"));

module.exports = routes;
