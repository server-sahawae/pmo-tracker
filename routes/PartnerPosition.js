const {
  createPartnerPosition,
  searchAllPartnerPositions,
  searchPartnerPositionById,
} = require("../controllers/PartnerPosition");

const routes = require("express").Router();

routes.post("/create", createPartnerPosition);
routes.get("/search/:PartnerId", searchAllPartnerPositions);
routes.get("/:search", searchPartnerPositionById);

module.exports = routes;
