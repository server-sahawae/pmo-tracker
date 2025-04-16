const {
  createCategory,
  findAllCategories,
  findAllCategoriesBut,
} = require("../controllers/category");

const routes = require("express").Router();

routes.post("/add", createCategory);
routes.get("/", findAllCategories);
routes.get("/:CategoryId", findAllCategoriesBut);

module.exports = routes;
