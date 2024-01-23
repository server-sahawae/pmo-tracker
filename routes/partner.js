const {
  createPartner,
  searchAllPartners,
  searchPartnerById,
  findAllPartnersByInstitutionId,
} = require("../controllers/partner");

const routes = require("express").Router();

routes.post("/create", createPartner);
routes.get("/institution/:InstitutionId", findAllPartnersByInstitutionId);
routes.get("/search/:search", searchAllPartners);
routes.get("/:search", searchPartnerById);

module.exports = routes;
