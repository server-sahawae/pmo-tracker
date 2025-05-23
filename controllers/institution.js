const { Op, transaction, where } = require("sequelize");
const { UNAUTHORIZED, BAD_REQUEST } = require("../constants/ErrorKeys");
const moment = require("moment");
const {
  Institution,
  Project,
  Activity,
  ProgramIndicator,
  sequelize,
  Partner,
  Program,
} = require("../models");
const { redisSearch } = require("../config/redis");
const { expireRedis } = require("../constants/staticValue");

module.exports = class Controller {
  static async createInstitution(req, res, next) {
    try {
      const { name } = req.body;
      const t = await transaction;
      const result = await Institution.findOrCreate({
        where: { name },
        defaults: {},
        transaction: t,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async findAllInstitutions(req, res, next) {
    try {
      const redisCheck = await redisSearch.get(`AllInstitutions`);
      if (!redisCheck) {
        const result = await Institution.findAll();
        await redisSearch.set(
          `AllInstitutions`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
        );
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async institutionProgramReport(req, res, next) {
    try {
      const { quarter = "all", year = new Date().getFullYear() } = req.query;
      const { InstitutionId } = req.params;
      let quarterTime;
      if (quarter == "all")
        quarterTime = moment().format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 1)
        quarterTime = moment(`${year}-03-01`)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 2)
        quarterTime = moment(`${year}-06-01`)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 3)
        quarterTime = moment(`${year}-09-01`)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 4)
        quarterTime = moment(`${year}-12-01`)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");

      const IndicatorProject = JSON.parse(
        JSON.stringify(
          await ProgramIndicator.findAll({
            attributes: [],
            include: [
              {
                attributes: ["id"],
                model: Program,
                include: {
                  model: Partner,
                  attributes: ["id"],
                  include: {
                    model: Institution,
                    where: { id: InstitutionId },
                  },
                },
              },
              {
                model: Project,
                attributes: ["id"],
                include: {
                  model: Activity,
                  attributes: ["score"],
                  // group: ["ProjectId"],
                  where: {
                    [Op.and]: [
                      {
                        start: {
                          [Op.gte]: moment(`${year}-01-01`)
                            .startOf("year")
                            .format("YYYY-MM-DD HH:mm:ss"),
                        },
                      },
                      {
                        start: {
                          [Op.lte]: quarterTime,
                        },
                      },
                      { summary: { [Op.not]: null } },
                    ],
                  },
                },
              },
            ],
          })
        )
      ).filter((el) => el.Program.Partner);

      let finalScore = 0;
      const IndicatorScore = IndicatorProject.filter((el) => el.Projects.length)
        .map((el) => {
          return el.Projects;
        })
        .filter((el) => el)
        .forEach((el) => {
          const scoring = el.map((zz) => {
            let projScore = 0;
            zz.Activities.forEach((act) => {
              projScore += act.score;
            });
            return { id: zz.id, score: projScore };
          });

          const indexMax = scoring.findIndex(
            (ind) => ind.score == Math.max(...scoring.map((a) => a.score))
          );
          finalScore += scoring[indexMax].score;
        });
      const progresPercetage =
        Math.round((finalScore / IndicatorProject.length) * 100) / 100;
      // res.status(200).json(finalScore/ IndicatorProject.length) * 100) / 100);
      res.status(200).json(progresPercetage);
    } catch (error) {
      next(error);
    }
  }

  static async institutionSinergy(req, res, next) {
    try {
      const { quarter = "all", year = new Date().getFullYear() } = req.query;
      let quarterTime;
      if (quarter == "all")
        quarterTime = moment().format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 1)
        quarterTime = moment(`${year}-03-01`)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 2)
        quarterTime = moment(`${year}-06-01`)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 3)
        quarterTime = moment(`${year}-09-01`)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 4)
        quarterTime = moment(`${year}-12-01`)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");

      const [result] = await sequelize.query(
        `
        WITH "ProjectScores" AS (
          SELECT "ProjectId", SUM(score) AS "TotalScore"
          FROM "Activities"
          WHERE summary IS NOT NULL AND "deletedAt" IS NULL
          GROUP BY "ProjectId"
          HAVING SUM(score) >= 80
        )
        SELECT 
          i.id,
          i.name,
          COUNT(p."InstitutionId") - COUNT(DISTINCT pp."ProjectId") AS "TotalSinergy",
          COUNT(DISTINCT pp."ProjectId") AS "TotalProject",
          COUNT(DISTINCT pp."PartnerId") AS "TotalPartner"
        FROM "PartnerProjects" pp
        INNER JOIN "Partners" p ON pp."PartnerId" = p.id AND p."deletedAt" IS NULL
        INNER JOIN "Projects" p2 ON p2.id = pp."ProjectId" AND p2."deletedAt" IS NULL
        INNER JOIN "ProjectScores" ps ON ps."ProjectId" = p2.id
        INNER JOIN "Institutions" i ON p."InstitutionId" = i.id AND i."deletedAt" IS NULL
        WHERE pp."deletedAt" IS NULL AND p2."end" <= :quarterTime
        GROUP BY p."InstitutionId", i.id, i.name
        `,
        {
          replacements: { quarterTime },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
