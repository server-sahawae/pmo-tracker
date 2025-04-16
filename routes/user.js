const {
  searchUserById,
  GoogleVerification,
  login,
  createUser,
  getAllUsers,
  getUserLevelById,
  deleteUserLevelByUserLevelId,
  deleteUserByUserId,
  getUserLevelList,
} = require("../controllers/user");
const {
  getUserFromAccessToken,
  adminPass,
} = require("../middlewares/authHandler");
const { deleteRedisKeys } = require("../middlewares/redis");

const routes = require("express").Router();

routes.post(
  "/",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  createUser
);
routes.get("/", getUserFromAccessToken, adminPass, getAllUsers);
routes.get("/level/", getUserLevelList);
routes.get("/level/:UserId", getUserLevelById);
routes.delete(
  "/level/:UserLevelId",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  deleteUserLevelByUserLevelId
);
routes.get("/google", getUserFromAccessToken, GoogleVerification);
routes.get("/login", login);
routes.get("/:id", searchUserById);
routes.delete(
  "/:id",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  deleteUserByUserId
);

module.exports = routes;
