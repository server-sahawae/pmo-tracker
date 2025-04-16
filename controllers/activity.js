const { Op, where } = require("sequelize");
const { sequelize, Sequelize } = require("../models");
const {
  Activity,
  Discussion,
  PartnerProject,
  Category,
  Partner,
  Institution,
  Project,
  PartnerProjectActivity,
} = require("../models");
const { KADIN_ONLY, DATA_NOT_FOUND } = require("../constants/ErrorKeys");
const moment = require("moment");
const { kadinIndonesia, expireRedis } = require("../constants/staticValue");
const { redisPMO, redisSearch } = require("../config/redis");
const { v4 } = require("uuid");
module.exports = class Controller {
  static async createActivity(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const activity = req.body;
      const { id: userAccessId } = req.access;

      let result = [];
      if (!activity.info.id) {
        console.log("********************************");
        console.log("CREATE!!!");
        console.log(v4());
        console.log("********************************");
        result = await Activity.create(
          {
            ...activity.info,
            PartnerId: activity.PartnerId,
            ProjectId: activity.ProjectId,
            createdBy: userAccessId,
            updatedBy: userAccessId,
            id: v4(),
          },
          { transaction: t }
        );
      } else
        result = await Activity.update(
          {
            ...activity.info,
            PartnerId: activity.PartnerId,
            ProjectId: activity.ProjectId,
            updatedBy: userAccessId,
          },
          { transaction: t, where: { id: activity.info.id } }
        );
      await Discussion.bulkCreate(
        activity.Discussions.map((el) => {
          return {
            ...el,
            updatedAt: new Date(),
            ActivityId: result.id,
          };
        }).filter((el) => !(el.deletedAt && !el.id)),
        {
          transaction: t,
          updateOnDuplicate: [
            "id",
            "ActivityId",
            "description",
            "updatedAt",
            "deletedAt",
          ],
        }
      );

      // await t.rollback();
      await t.commit();
      res.status(200).json("result");
    } catch (error) {
      await t.rollback();
      console.log(error);
      next(error);
    }
  }

  static async deleteActivity(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { ActivityId } = req.params;
      const result = await Activity.destroy(
        { where: { id: ActivityId } },
        { transaction: t }
      );

      await Discussion.destroy({ where: { ActivityId } }, { transaction: t });

      await PartnerProject.destroy(
        { where: { ActivityId } },
        { transaction: t }
      );

      await t.rollback();
      // await t.commit();
      res.status(200).json(result);
    } catch (error) {
      await t.rollback();
      console.log(error);
      next(error);
    }
  }
  static async findAllActivitiesByInstitutionId(req, res, next) {
    try {
      const { InstitutionId } = req.params;
      const {
        time = "future",
        data_per_page = 10,
        page = 1,
        isComplete = "all",
        search,
      } = req.query;

      const options = {};

      if (time == "past")
        options.where = {
          ...options.where,
          end: { [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss") },
        };
      else if (time == "future")
        options.where = {
          ...options.where,
          end: { [Op.gt]: moment().format("YYYY-MM-DD HH:mm:ss") },
        };

      if (search) {
        options.where = {
          ...options.where,
          [Op.and]: [
            {
              [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } },
                { summary: { [Op.like]: `%${search}%` } },
                { "$Project.title$": { [Op.like]: `%${search}%` } },
              ],
            },
            { summary: { [Op.not]: null } },
          ],
        };
      }

      if (isComplete == "complete") {
        options.where.summary = { [Op.not]: null };
      }

      if (isComplete == "incomplete") {
        options.where.summary = { [Op.is]: null };
      }

      const data = JSON.parse(
        JSON.stringify(
          await Activity.findAll({
            attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
            order: [["start", time == "future" ? "ASC" : "DESC"]],
            // limit: Number(data_per_page),
            // offset: (Number(page) - 1) * Number(data_per_page),
            include: {
              model: Project,
              attributes: ["id", "title"],
              // where: options.Project,
              include: {
                model: Partner,
                attributes: [],
                include: { model: Institution, where: { id: InstitutionId } },
                attributes: ["id"],
              },
            },

            where: { ...options.where },
          })
        )
      );
      if (!data.length) throw { name: DATA_NOT_FOUND };
      if (Math.ceil(data.count / data_per_page) < page)
        throw { name: DATA_NOT_FOUND };

      const result = {
        last_page: Math.ceil(data.length / data_per_page),
        current_page: Number(page),
        data_per_page: Number(data_per_page),
        count: data.length,
        rows: data.slice(data_per_page * (page - 1), data_per_page * page),
      };
      // const result = data;
      console.log(
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );
      console.log(options.where);
      console.log(
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async findAllActivitiesByProjectId(req, res, next) {
    try {
      const { ProjectId } = req.params;
      const { time } = req.query;

      const redisCheck = await redisPMO.get(
        `findAll${time}ActivitiesByProjectId:${ProjectId}`
      );
      // let options = { ProjectId };
      const options = { where: { ProjectId } };
      if (time == "past")
        options.where = {
          ProjectId,
          start: { [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss") },
        };
      else if (time == "future")
        options.where = {
          ProjectId,
          start: { [Op.gt]: moment().format("YYYY-MM-DD HH:mm:ss") },
        };

      if (!redisCheck) {
        const result = await Activity.findAll({
          order: [["start", time == "past" ? "DESC" : "ASC"]],
          attributes: { exclude: ["deletedAt", "updatedAt", "createdAt"] },
          where: options.where,
          include: [
            {
              model: Discussion,
              order: [["createdAt", "ASC"]],
              attributes: { exclude: ["deletedAt", "updatedAt", "createdAt"] },
            },
            { model: Category, attributes: ["name"] },
          ],
        });

        await redisPMO.set(
          `findAll${time}ActivitiesByProjectId:${ProjectId}`,
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

  static async findAllNonProjectActivitiesByPartnerId(req, res, next) {
    try {
      const { PartnerId } = req.params;
      const redisCheck = await redisPMO.get(
        `findAllNonProjectActivitiesByPartnerId:${PartnerId}`
      );
      if (!redisCheck) {
        const result = await Activity.findAll({
          order: [["start", "desc"]],
          attributes: { exclude: ["deletedAt", "updatedAt", "createdAt"] },
          where: {
            [Op.and]: [{ ProjectId: { [Op.is]: null } }, { PartnerId }],
          },
          include: [
            {
              model: Discussion,
              order: [["createdAt", "ASC"]],
              attributes: { exclude: ["deletedAt", "updatedAt", "createdAt"] },
            },
            { model: Category, attributes: ["name"] },
          ],
        });
        console.log(result);
        await redisPMO.set(
          `findAllNonProjectActivitiesByPartnerId:${PartnerId}`,
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

  static async recapActivites(req, res, next) {
    try {
      const { quarter = "all", year = new Date().getFullYear() } = req.query;
      let quarterTime = "";
      if (quarter == "all") {
        if (new Date().getFullYear() == year)
          quarterTime = moment().format("YYYY-MM-DD HH:mm:ss");
        else
          quarterTime = moment(new Date(`${year}-1-1`))
            .endOf("year")
            .format("YYYY-MM-DD HH:mm:ss");
      } else if (quarter == 1)
        quarterTime = moment(new Date(`${year}-3-1`))
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 2)
        quarterTime = moment(new Date(`${year}-6-1`))
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 3)
        quarterTime = moment(new Date(`${year}-9-1`))
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
      else if (quarter == 4)
        quarterTime = moment(new Date(`${year}-12-1`))
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");

      const result = (
        await sequelize.query(`SELECT c.name, COUNT(a.CategoryId) as Total FROM Activities a
      INNER JOIN Categories c ON c.id = a.CategoryId
      WHERE a.end >= '${year}-01-01 00:00:00' AND a.end <= '${quarterTime}' 
      GROUP BY a.CategoryId `)
      )[0];
      console.log(
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );

      console.log(quarterTime);
      console.log(
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
