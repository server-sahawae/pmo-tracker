const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { Project, ProjectRundown, ProjectInvitation } = require("../models");
const { KADIN_ONLY } = require("../constants/ErrorKeys");

const { kadinIndonesia } = require("../constants/staticValue");
const { redisPMO } = require("../config/redis");
const { deleteRedisKeys } = require("../helpers/redis");
const projectinvitation = require("../models/projectinvitation");
module.exports = class Controller {
  static async createProject(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const data = req.body;
      // console.log(data);

      const project = await Project.create(data.project, { transaction: t });
      if (data.ProjectRundown.length) {
        await ProjectRundown.bulkCreate(
          data.ProjectRundown.map((el) => {
            return {
              ...el,
              ProjectId: project.id,
              updatedAt: new Date(),
            };
          }).filter((el) => !(el.deletedAt && !el.id)),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "ProgramId",
              "description",
              "updatedAt",
              "deletedAt",
            ],
          }
        );
      }
      await ProjectInvitation.bulkCreate(
        data.ProjectInvitation.map((el) => {
          return {
            ...el,
            ProjectId: project.id,
            updatedAt: new Date(),
          };
        }).filter((el) => !(el.deletedAt && !el.id)),
        {
          transaction: t,
        }
      );
      // await t.rollback();
      await t.commit();

      res.status(200).json(data);
    } catch (error) {
      await t.rollback();
      console.log(error);
      next(error);
    }
  }
};
// ProjectCategoryId: DataTypes.UUID,
// title: DataTypes.STRING,
// location: DataTypes.STRING,
// start: DataTypes.DATE,
// end: DataTypes.DATE,
// background: DataTypes.TEXT,
// flyer: DataTypes.BOOLEAN,
// photo: DataTypes.BOOLEAN,
// video: DataTypes.BOOLEAN,
// release: DataTypes.BOOLEAN,
