const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { Category } = require("../models");
const { KADIN_ONLY } = require("../constants/ErrorKeys");

const { kadinIndonesia, expireRedis } = require("../constants/staticValue");
const { redisPMO } = require("../config/redis");
module.exports = class Controller {
  static async createCategory(req, res, next) {
    try {
      res.status(200).json("masuk");
    } catch (error) {}
  }
  static async findAllCategories(req, res, next) {
    try {
      const redisCheck = await redisPMO.get(`findAllCategories`);
      if (!redisCheck) {
        const result = await Category.findAll({ attributes: ["id", "name"] });
        await redisPMO.set(
          `findAllCategories`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
        );
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      next(error);
    }
  }

  static async findAllCategoriesBut(req, res, next) {
    try {
      const { CategoryId } = req.params;
      const redisCheck = await redisPMO.get(
        `findAllCategoriesBut:${CategoryId}`
      );
      if (!redisCheck) {
        const result = await Category.findAll({
          where: { id: { [Op.not]: CategoryId } },
          attributes: ["id", "name"],
        });
        await redisPMO.set(
          `findAllCategoriesBut:${CategoryId}`,
          JSON.stringify(result, null, 2),
          { EX: expireRedis }
        );
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      next(error);
    }
  }
};
// ProjectCategoryId: DataTypes.UUIDV4,
// title: DataTypes.STRING,
// location: DataTypes.STRING,
// start: DataTypes.DATE,
// end: DataTypes.DATE,
// background: DataTypes.TEXT,
// flyer: DataTypes.BOOLEAN,
// photo: DataTypes.BOOLEAN,
// video: DataTypes.BOOLEAN,
// release: DataTypes.BOOLEAN,
