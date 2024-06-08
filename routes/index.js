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
const assignmentRoutes = require("./assignment");
const gdriveRoutes = require("./gdrive");
const { redisPMO, redisSearch } = require("../config/redis");

routes.get("/", async (req, res) => {
  try {
    // throw "error";
    await redisPMO.flushAll();
    await redisSearch.flushAll();
    res.send("Redis Flush!");
  } catch (error) {
    res.send(error);
  }
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
routes.use("/assignment", assignmentRoutes);
routes.use("/gdrive", gdriveRoutes);

module.exports = routes;
