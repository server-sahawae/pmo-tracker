const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { Project } = require("../models");
const { KADIN_ONLY } = require("../constants/ErrorKeys");

const { kadinIndonesia } = require("../constants/staticValue");
const { redisPMO } = require("../config/redis");
const { deleteRedisKeys } = require("../helpers/redis");
module.exports = class Controller {
  static async createProject(req, res, next) {
    const t = await sequelize.transaction();
    try {
    } catch (error) {}
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
