const routes = require("express").Router();

const programRoutes = require("./program");
const institutionRoutes = require("./institution");
const partnerRoutes = require("./partner");
const committeeRoutes = require("./committee");
const priorityRoutes = require("./priority");
const indicatorRoutes = require("./indicator");
const categoryRoutes = require("./category");
const userRoutes = require("./user");

routes.get("/", (req, res) => {
  res.send("HELLO WORLD");
});
routes.use("/program", programRoutes);
routes.use("/institution", institutionRoutes);
routes.use("/partner", partnerRoutes);
routes.use("/committee", committeeRoutes);
routes.use("/priority", priorityRoutes);
routes.use("/indicator", indicatorRoutes);
routes.use("/category", categoryRoutes);
routes.use("/user", userRoutes);

module.exports = routes;
