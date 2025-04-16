const {
  createPartnerPosition,
  searchAllPartnerPositions,
  searchPartnerPositionById,
} = require("../controllers/PartnerPosition");
const {
  getUserFromAccessToken,
  adminPass,
} = require("../middlewares/authHandler");
const { deleteRedisKeys } = require("../middlewares/redis");
const routes = require("express").Router();

routes.post(
  "/create",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  createPartnerPosition
);
routes.get("/search/:PartnerId", searchAllPartnerPositions);
routes.get("/:search", searchPartnerPositionById);

module.exports = routes;
