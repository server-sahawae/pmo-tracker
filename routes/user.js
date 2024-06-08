const {
  searchAllUsers,
  searchUserById,
  GoogleVerification,
  login,
  createUser,
} = require("../controllers/user");
const { getUserFromAccessToken } = require("../middlewares/authHandler");

const routes = require("express").Router();

routes.post("/", getUserFromAccessToken, createUser);
routes.get("/search/:search", searchAllUsers);
routes.get("/google", getUserFromAccessToken, GoogleVerification);
routes.get("/login", login);
routes.get("/:id", searchUserById);

module.exports = routes;
