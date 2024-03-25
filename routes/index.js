const routes = require("express").Router();

const programRoutes = require("./program");
const institutionRoutes = require("./institution");
const partnerRoutes = require("./partner");
const PartnerPositionRoutes = require("./PartnerPosition");
const priorityRoutes = require("./priority");
const indicatorRoutes = require("./indicator");
const categoryRoutes = require("./category");
const userRoutes = require("./user");
const ProgramIndicatorRoutes = require("./ProgramIndicator");
const projectRoutes = require("./project");
const activityRoutes = require("./activity");

routes.get("/", (req, res) => {
  res.send("HELLO WORLD");
});
routes.use("/program", programRoutes);
routes.use("/institution", institutionRoutes);
routes.use("/partner", partnerRoutes);
routes.use("/PartnerPosition", PartnerPositionRoutes);
routes.use("/priority", priorityRoutes);
routes.use("/indicator", indicatorRoutes);
routes.use("/category", categoryRoutes);
routes.use("/user", userRoutes);
routes.use("/ProgramIndicator", ProgramIndicatorRoutes);
routes.use("/project", projectRoutes);
routes.use("/activity", activityRoutes);

module.exports = routes;
