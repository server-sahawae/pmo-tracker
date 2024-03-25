const { Op } = require("sequelize");
const { sequelize } = require("../models");
const {
  Project,
  ProjectRundown,
  ProjectProgramIndicator,
  PartnerProjectActivity,
  Category,
  Partner,
  Institution,
  Program,
  ProgramIndicator,
  Activity,
} = require("../models");
const { deleteRedisKeys } = require("../helpers/redis");
const { DATA_NOT_FOUND } = require("../constants/ErrorKeys");
const { redisPMO } = require("../config/redis");
const { expireRedis } = require("../constants/staticValue");
module.exports = class Controller {
  static async createProject(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const data = req.body;
      console.log(data.PartnerId);

      const project = await Project.create(data.project, { transaction: t });
      await deleteRedisKeys([data.PartnerId]);
      await PartnerProjectActivity.create(
        { PartnerId: data.PartnerId, ProjectId: project.id, isOwner: true },
        { transaction: t }
      );
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

      if (data.ProjectIndicators.length) {
        await ProjectProgramIndicator.bulkCreate(
          data.ProjectIndicators.map((el) => {
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

      if (data.Sinergy?.length) {
        await PartnerProjectActivity.bulkCreate(
          data.Sinergy.map((el) => {
            return {
              PartnerId: el.id,
              ProjectId: project.id,
              updatedAt: new Date(),
            };
          }).filter((el) => !(el.deletedAt && !el.id)),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "PartnerId",
              "ActivityId",
              "ProjectId",
              "updatedAt",
              "deletedAt",
            ],
          }
        );
      }
      // await ProjectInvitation.bulkCreate(
      //   data.ProjectInvitation.map((el) => {
      //     return {
      //       ...el,
      //       ProjectId: project.id,
      //       updatedAt: new Date(),
      //     };
      //   }).filter((el) => !(el.deletedAt && !el.id)),
      //   {
      //     transaction: t,
      //   }
      // );

      // await t.rollback();
      await t.commit();
      console.log("SUCCESS!!!");
      res.status(200).json(data);
    } catch (error) {
      await t.rollback();
      console.log(error);
      next(error);
    }
  }

  static async findAllProjectsByProgramId(req, res, next) {
    try {
      const { ProgramId } = req.params;
      const redisCheck = await redisPMO.get(
        `findAllProjectsByProgramId:${ProgramId}`
      );
      if (redisCheck) {
        res.status(200).json(JSON.parse(redisCheck));
      } else {
        const projects = JSON.parse(
          JSON.stringify(
            await Project.findAll({
              include: [
                { model: Category },
                { model: ProjectProgramIndicator, where: { ProgramId } },
                {
                  model: PartnerProjectActivity,
                  attributes: ["id"],
                  include: {
                    model: Partner,
                    attributes: ["id", "name", "chief"],
                    include: { model: Institution, attributes: ["id", "name"] },
                  },
                },
              ],
            })
          )
        );
        const result = projects.map((el) => {
          el.image = el.image ? true : false;
          return el;
        });
        if (result.length > 0)
          await redisPMO.set(
            `findAllProjectsByProgramId:${ProgramId}`,
            JSON.stringify(result, null, 2),
            { EX: expireRedis }
          );
        res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  static async findAllProjectsWithoutProgram(req, res, next) {
    try {
      const { PartnerId } = req.params;
      const redisCheck = await redisPMO.get(
        `findAllProjectsWithoutProgram:${PartnerId}`
      );
      if (redisCheck) {
        res.status(200).json(JSON.parse(redisCheck));
      } else {
        const projects = JSON.parse(
          JSON.stringify(
            await Project.findAll({
              include: [
                { model: Category },
                {
                  model: ProjectProgramIndicator,
                  include: { model: Program, where: { PartnerId } },
                },
                {
                  model: PartnerProjectActivity,
                  attributes: ["PartnerId", "id"],
                  include: {
                    model: Partner,
                    attributes: ["id", "name", "chief"],
                    include: { model: Institution, attributes: ["id", "name"] },
                  },
                },
              ],
            })
          )
        );
        const result = projects
          .map((el) => {
            el.image = el.image ? true : false;
            return el;
          })
          .filter((el) => {
            return JSON.stringify(el.PartnerProjectActivities).includes(
              PartnerId
            );
          });
        if (result.length > 0)
          await redisPMO.set(
            `findAllProjectsWithoutProgram:${PartnerId}`,
            JSON.stringify(
              result.filter((el) => !el.ProjectProgramIndicators.length),
              null,
              2
            ),
            { EX: expireRedis }
          );
        res
          .status(200)
          .json(result.filter((el) => !el.ProjectProgramIndicators.length));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async findProjectById(req, res, next) {
    try {
      const { ProjectId } = req.params;
      const redisCheck = await redisPMO.get(`findProjectById:${ProjectId}`);
      if (redisCheck) {
        res.status(200).json(JSON.parse(redisCheck));
      } else {
        console.log(
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );
        const result = await Project.findOne({
          where: { id: ProjectId },
          attributes: {
            exclude: ["updatedAt", "createdAt", "deletedAt", "CategoryId"],
          },
          include: [
            { model: Category, attributes: ["id", "name"] },
            {
              model: PartnerProjectActivity,
              attributes: ["id", "isOwner"],
              include: [
                {
                  model: Partner,
                  attributes: ["id", "name", "chief"],
                  include: { model: Institution, attributes: ["id", "name"] },
                },
              ],
            },
            {
              model: ProjectProgramIndicator,
              attributes: ["id"],
              include: [
                {
                  model: ProgramIndicator,
                  attributes: ["id", "description"],
                  include: [
                    {
                      model: Program,
                      attributes: ["id", "name", "rapimnas"],
                      include: {
                        model: Partner,
                        attributes: ["id", "name", "chief"],
                        include: {
                          model: Institution,
                          attributes: ["id", "name"],
                        },
                      },
                    },
                  ],
                },
              ],
            },
            { model: ProjectRundown },
          ],
          order: [[ProjectRundown, "start", "ASC"]],
        });
        if (!result) throw { name: DATA_NOT_FOUND };

        result.dataValues.image = result.dataValues.image ? true : false;

        await redisPMO.set(
          `findProjectById:${ProjectId}`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
        );

        console.log(
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async uploadImage(req, res, next) {
    try {
      const { id } = req.params;
      console.log(req);
      await Project.update({ image: req.files.logo.data }, { where: { id } });
      res.status(200).send("Logo has been uploaded successfully!");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async ProjectImage(req, res, next) {
    try {
      const { ProjectId } = req.params;
      const { image } = await Project.findOne({
        where: { id: ProjectId },
      });
      // console.log(image);
      res.status(200).type("image/webp").send(Buffer.from(image));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteProject(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { ProjectId } = req.params;
      await deleteRedisKeys([ProjectId]);

      await Project.destroy({ where: { id: ProjectId } }, { transaction: t });
      await PartnerProjectActivity.destroy(
        { where: { ProjectId: ProjectId } },
        { transaction: t }
      );

      await ProjectRundown.destroy(
        { where: { ProjectId: ProjectId } },
        { transaction: t }
      );

      await ProjectProgramIndicator.destroy(
        { where: { ProjectId: ProjectId } },
        { transaction: t }
      );

      await Activity.destroy(
        {
          include: {
            model: PartnerProjectActivity,
            where: { ProjectId: ProjectId },
          },
        },
        { transaction: t }
      );

      await PartnerProjectActivity.destroy(
        { where: { ProjectId: ProjectId } },
        { transaction: t }
      );

      // await t.rollback();
      await t.commit();
      res.status(200).json("Project has been deleted!");
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  }
};
