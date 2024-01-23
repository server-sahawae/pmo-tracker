const {
  createCategory,
  findAllCategories,
} = require("../controllers/category");

const routes = require("express").Router();

routes.post("/add", createCategory);
routes.get("/", findAllCategories);

module.exports = routes;
