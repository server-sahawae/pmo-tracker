const {
  searchUserById,
  GoogleVerification,
  login,
  createUser,
  getAllUsers,
  getUserLevelById,
  deleteUserLevelByUserLevelId,
} = require("../controllers/user");
const {
  getUserFromAccessToken,
  adminPass,
} = require("../middlewares/authHandler");

const routes = require("express").Router();

routes.post("/", getUserFromAccessToken, createUser);
routes.get("/", getUserFromAccessToken, adminPass, getAllUsers);
routes.get("/level/:UserId", getUserLevelById);
routes.delete("/level/:UserLevelId", deleteUserLevelByUserLevelId);
routes.get("/google", getUserFromAccessToken, GoogleVerification);
routes.get("/login", login);
routes.get("/:id", searchUserById);

module.exports = routes;
