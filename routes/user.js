const { searchAllUsers, searchUserById } = require("../controllers/user");

const routes = require("express").Router();

routes.get("/search/:search", searchAllUsers);
routes.get("/:id", searchUserById);

module.exports = routes;
