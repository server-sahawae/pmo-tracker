const {
  createPartner,
  searchAllPartners,
  searchPartnerById,
  findAllPartnersByInstitutionId,
  searchPartners,
} = require("../controllers/partner");
const {
  getUserFromAccessToken,
  adminPass,
} = require("../middlewares/authHandler");
const { deleteRedisKeys } = require("../middlewares/redis");

const routes = require("express").Router();

routes.get("/", searchPartners);
routes.post(
  "/create",
  deleteRedisKeys,
  getUserFromAccessToken,
  adminPass,
  createPartner
);
routes.get("/institution/:InstitutionId", findAllPartnersByInstitutionId);
routes.get("/search/:search", searchAllPartners);
routes.get("/:search", searchPartnerById);

module.exports = routes;
