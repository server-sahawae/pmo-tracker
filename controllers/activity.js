const { Op } = require("sequelize");
const { sequelize } = require("../models");
const {
  Activity,
  Discussion,
  PartnerProjectActivity,
  Category,
} = require("../models");
const { KADIN_ONLY } = require("../constants/ErrorKeys");

const { kadinIndonesia, expireRedis } = require("../constants/staticValue");
const { redisPMO } = require("../config/redis");
const { deleteRedisKeys } = require("../helpers/redis");
module.exports = class Controller {
  static async createActivity(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const activity = req.body;

      await deleteRedisKeys(activity.PartnerId);
      await deleteRedisKeys(activity.ProjectId);

      const result = await Activity.create(activity.info, { transaction: t });
      await Discussion.bulkCreate(
        activity.discussion
          .map((el) => {
            return {
              ...el,
              ActivityId: result.id,
            };
          })
          .filter((el) => !(el.deletedAt && !el.id)),
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

      await PartnerProjectActivity.create(
        {
          PartnerId: activity.PartnerId,
          ProjectId: activity.ProjectId,
          ActivityId: result.id,
        },
        { transaction: t }
      );
      // await t.rollback();
      await t.commit();
      res.status(200).json(result);
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
      await deleteRedisKeys([ActivityId]);
      const result = await Activity.destroy(
        { where: { id: ActivityId } },
        { transaction: t }
      );

      await Discussion.destroy({ where: { ActivityId } }, { transaction: t });

      await PartnerProjectActivity.destroy(
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

  static async findAllActivitiesByProjectId(req, res, next) {
    try {
      const { ProjectId } = req.params;

      const allActivity = await Activity.findAll({
        order: [["start", "desc"]],
        attributes: [
          "id",
          "title",
          "location",
          "start",
          "end",
          "summary",
          "isMain",
          "flyer",
          "photo",
          "video",
          "release",
        ],
        include: [
          {
            model: PartnerProjectActivity,
            where: { ProjectId },
            attributes: [],
          },
          {
            model: Discussion,
            order: [["createdAt", "ASC"]],
            attributes: ["topic", "speaker", "description"],
          },
          { model: Category, attributes: ["name"] },
        ],
      });

      const pastActivity = await Activity.findAll({
        where: { start: { [Op.lte]: new Date() } },
        order: [["start", "desc"]],
        attributes: [
          "id",
          "title",
          "location",
          "start",
          "end",
          "summary",
          "isMain",
          "flyer",
          "photo",
          "video",
          "release",
        ],
        include: [
          {
            model: PartnerProjectActivity,
            where: { ProjectId },
            attributes: [],
          },
          { model: Category, attributes: ["name"] },
          {
            model: Discussion,
            order: [["createdAt", "ASC"]],
            attributes: ["topic", "speaker", "description"],
          },
        ],
      });

      const futureActivity = await Activity.findAll({
        where: { start: { [Op.gt]: new Date() } },
        order: [["start", "asc"]],
        attributes: [
          "id",
          "title",
          "location",
          "start",
          "end",
          "summary",
          "isMain",
          "flyer",
          "photo",
          "video",
          "release",
        ],
        include: [
          {
            model: PartnerProjectActivity,
            where: { ProjectId },
            attributes: [],
          },
          { model: Category, attributes: ["name"] },
          {
            model: Discussion,
            order: [["createdAt", "ASC"]],
            attributes: ["topic", "speaker", "description"],
          },
        ],
      });

      res
        .status(200)
        .json({ all: allActivity, past: pastActivity, future: futureActivity });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async findAllNonProjectActivitiesByPartnerId(req, res, next) {
    try {
      const { PartnerId } = req.params;

      const result = await Activity.findAll({
        order: [["start", "desc"]],
        attributes: [
          "id",
          "title",
          "location",
          "start",
          "end",
          "summary",
          "isMain",
          "flyer",
          "photo",
          "video",
          "release",
        ],
        include: [
          {
            model: PartnerProjectActivity,
            where: { [Op.and]: [{ PartnerId }, { ProjectId: null }] },
            attributes: [],
          },
          {
            model: Discussion,
            order: [["createdAt", "ASC"]],
            attributes: ["topic", "speaker", "description"],
          },
          { model: Category, attributes: ["name"] },
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
