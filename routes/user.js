const {
  searchAllUsers,
  searchUserById,
  GoogleVerification,
} = require("../controllers/user");

const routes = require("express").Router();

routes.get("/search/:search", searchAllUsers);
routes.get("/google", GoogleVerification);
routes.get("/:id", searchUserById);

module.exports = routes;
