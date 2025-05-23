const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { v4 } = require("uuid");
const {
  Project,
  ProjectRundown,
  ProjectProgramIndicator,
  PartnerProject,
  Category,
  Partner,
  Institution,
  Program,
  ProgramIndicator,
  Activity,
} = require("../models");
const { DATA_NOT_FOUND } = require("../constants/ErrorKeys");
const { redisPMO, redisSearch } = require("../config/redis");
const { expireRedis } = require("../constants/staticValue");
module.exports = class Controller {
  static async createProject(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const data = req.body;
      // console.log(data.PartnerxId);
      const { id: userAccessId } = req.access;
      // console.log(data);

      const [project, created] = await Project.findOrCreate({
        where: { id: data.project.id || v4() },
        defaults: {
          ...data.project,
          createdBy: userAccessId,
          updatedBy: userAccessId,
        },
        transaction: t,
      });
      delete data.project.image;
      if (!created) {
        await Project.update(
          { ...data.project, updatedBy: userAccessId },
          { where: { id: data.project.id } }
        );

        await PartnerProject.update(
          {
            PartnerId: data.PartnerId,
            ProjectId: project.id,
            createdBy: userAccessId,
            updatedBy: userAccessId,
          },
          { where: { id: data.project.id }, transaction: t }
        );
      } else
        await PartnerProject.create(
          {
            PartnerId: data.PartnerId,
            ProjectId: project.id,
            isOwner: true,
            createdBy: userAccessId,
            updatedBy: userAccessId,
          },
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
          }),
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
          }),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "ProgramId",
              "ProgramIndicatorId",
              "updatedAt",
              "deletedAt",
            ],
          }
        );
      }

      if (data.Sinergy?.length) {
        console.log(
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );

        await PartnerProject.bulkCreate(
          data.Sinergy.map((el) => {
            return {
              id: el.PartnerProject?.id,
              PartnerId: el.id,
              ProjectId: project.id,
              updatedAt: new Date(),
              createdBy: userAccessId,
              deletedAt: el.deletedAt,
            };
          }),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "PartnerId",
              "ProjectId",
              "updatedAt",
              "deletedAt",
            ],
          }
        );

        if (
          data.Sinergy.map((el) => {
            if (el.deletedAt)
              return {
                id: el.PartnerProject?.id,
              };
          }).filter((el) => el).length
        ) {
          console.log("MASUK");

          await PartnerProject.destroy({
            where: data.Sinergy.map((el) => {
              if (el.deletedAt)
                return {
                  id: el.PartnerProject?.id,
                };
            }),
            transaction: t,
          });
        }
      }

      await t.commit();
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

      const projects = JSON.parse(
        JSON.stringify(
          await Project.findAll({
            include: [
              { model: Category },
              { model: ProgramIndicator, where: { ProgramId } },
              {
                model: Partner,
                attributes: ["id", "name", "chief"],
                include: { model: Institution, attributes: ["id", "name"] },
              },
            ],
          })
        )
      );
      const result = projects.map((el) => {
        el.image = el.image ? true : false;
        return el;
      });
      // if (result.length > 0)

      await redisPMO.set(
        `findAllProjectsByProgramId:${ProgramId}`,
        JSON.stringify(result, null, 2),
        { EX: expireRedis }
      );
      res.status(200).json(result);
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
                  model: ProgramIndicator,
                  include: { model: Program, where: { PartnerId } },
                },
                {
                  model: Partner,
                  attributes: ["id", "name", "chief"],
                  include: { model: Institution, attributes: ["id", "name"] },
                },
              ],
            })
          )
        );
        const result = await projects
          .map((el) => {
            el.image = el.image ? true : false;
            return el;
          })
          .filter((el) => {
            return JSON.stringify(el.Partners).includes(PartnerId);
          });

        // if (result.length > 0)
        await redisPMO.set(
          `findAllProjectsWithoutProgram:${PartnerId}`,
          JSON.stringify(
            result.filter((el) => !el.ProgramIndicators.length),
            null,
            2
          ),
          { EX: expireRedis }
        );
        res
          .status(200)
          .json(result.filter((el) => !el.ProgramIndicators.length));
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
        const result = await Project.findOne({
          where: { id: ProjectId },
          attributes: {
            exclude: ["updatedAt", "createdAt", "deletedAt", "CategoryId"],
          },
          include: [
            { model: Category, attributes: ["id", "name"] },
            {
              model: Partner,
              attributes: ["id", "name", "chief", "InstitutionId"],
              include: { model: Institution, attributes: ["id", "name"] },
            },
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

            { model: ProjectRundown },
          ],
          order: [[ProjectRundown, "start", "ASC"]],
        });
        if (!result) throw { name: DATA_NOT_FOUND };
        const [projectScoreResult] = await sequelize.query(
          `
    SELECT SUM(a.score) AS "ProjectScores"
    FROM "Activities" a
    INNER JOIN "Projects" p ON p.id = a."ProjectId"
    WHERE a.start < NOW()
      AND a."ProjectId" = :projectId
      AND a.summary IS NOT NULL
      AND a."deletedAt" IS NULL
    GROUP BY a."ProjectId"
  `,
          {
            replacements: { projectId: ProjectId },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        result.dataValues.ProjectScores =
          projectScoreResult?.ProjectScores || 0;
        console.log("================================");
        console.log(result.dataValues.ProjectScores);
        console.log("================================");

        result.dataValues.image = result.dataValues.image ? true : false;

        await redisPMO.set(
          `findProjectById:${ProjectId}`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
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

      await Project.destroy({ where: { id: ProjectId } }, { transaction: t });
      await PartnerProject.destroy(
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
            model: PartnerProject,
            where: { ProjectId: ProjectId },
          },
        },
        { transaction: t }
      );

      await PartnerProject.destroy(
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

  static async projectScore(req, res, next) {
    try {
      const { ProjectId } = req.params;
      const [projectScoreResult] = await sequelize.query(
        `
      SELECT SUM(a.score) AS "ProjectScores"
      FROM "Activities" a
      INNER JOIN "Projects" p ON p.id = a."ProjectId"
      WHERE a.start < NOW()
        AND a."ProjectId" = :projectId
        AND a.summary IS NOT NULL
        AND a."deletedAt" IS NULL
      GROUP BY a."ProjectId"
      `,
        {
          replacements: { projectId: ProjectId },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const result = projectScoreResult?.ProjectScores || 0;

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
