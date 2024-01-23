const { Op } = require("sequelize");
const { sequelize } = require("../models");
const {
  Program,
  Partner,
  ProgramPartner,
  ProgramVision,
  ProgramDriver,
  ProgramIndicator,
  ProgramPhase,
  ProgramPriority,
  ProgramCommittee,
  Priority,
  Committee,
} = require("../models");
const { KADIN_ONLY } = require("../constants/ErrorKeys");

const { kadinIndonesia } = require("../constants/staticValue");
const { redisPMO } = require("../config/redis");
const { deleteRedisKeys } = require("../helpers/redis");
module.exports = class Controller {
  static async createProgram(req, res, next) {
    const t = await sequelize.transaction();
    try {
      // await redisPMO.connect();

      const {
        program,
        vision,
        partner,
        driver,
        indicator,
        phase,
        priority,
        committee,
      } = req.body;
      const institutionCheck = await Partner.findOne({
        where: {
          id: program.PartnerId,
          InstitutionId: kadinIndonesia,
        },
      });
      // console.log(institutionCheck);
      if (institutionCheck) {
        const { dataValues: createInfo } = await Program.create(
          {
            name: program.name,
            PartnerId: program.PartnerId,
          },
          { transaction: t }
        );
        await ProgramVision.bulkCreate(
          vision.map((el) => {
            return { ...el, ProgramId: createInfo.id };
          }),
          { transaction: t }
        );
        await ProgramPartner.bulkCreate(
          partner.map((el) => {
            return { ...el, ProgramId: createInfo.id };
          }),
          { transaction: t }
        );
        await ProgramDriver.bulkCreate(
          driver.map((el) => {
            return { ...el, ProgramId: createInfo.id };
          }),
          { transaction: t }
        );
        await ProgramIndicator.bulkCreate(
          indicator.map((el) => {
            return { ...el, ProgramId: createInfo.id };
          }),
          { transaction: t }
        );
        await ProgramPhase.bulkCreate(
          phase.map((el) => {
            return { ...el, ProgramId: createInfo.id };
          }),
          { transaction: t }
        );
        await ProgramPriority.bulkCreate(
          priority.map((el) => {
            return { ...el, ProgramId: createInfo.id };
          }),
          { transaction: t }
        );
        await ProgramCommittee.bulkCreate(
          committee.map((el) => {
            return { ...el, ProgramId: createInfo.id };
          }),
          { transaction: t }
        );
        await t.commit();
        console.log(
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );
        await deleteRedisKeys(program.PartnerId);
        res.status(200).json(`Program ${program.name} has been created!`);
      } else throw { name: KADIN_ONLY };
    } catch (error) {
      console.log(error);
      await t.rollback();
      await next(error);
    } finally {
      //       await redisPMO.disconnect();
      console.log("Redis closed");
    }
  }

  static async programsByDepartmentId(req, res, next) {
    try {
      // await redisPMO.connect();
      const { id: PartnerId } = req.params;

      const redisCheck = await redisPMO.get(`[Program]PartnerId:${PartnerId}`);
      if (redisCheck) {
        res.status(200).json(JSON.parse(redisCheck));
      } else {
        const result = await Program.findAll({
          where: { PartnerId },
          order: [["name", "asc"]],
        });
        if (result.length > 0)
          await redisPMO.set(
            `[Program]PartnerId:${PartnerId}`,
            JSON.stringify(result, null, 2),
            { EX: 60 * 60 * 24 }
          );
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async programDetail(req, res, next) {
    try {
      // await redisPMO.connect();

      const { id: ProgramId } = req.params;
      console.log(
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );
      console.log(ProgramId);
      const redisCheck = await redisPMO.get(
        `[ProgramDetail]ProgramId:${ProgramId}`
      );
      if (!redisCheck) {
        const { dataValues: data1 } = await Program.findOne({
          where: { id: ProgramId },
          include: [Partner, ProgramVision, ProgramDriver],
        });
        const { dataValues: data2 } = await Program.findOne({
          where: { id: ProgramId },
          include: [ProgramIndicator, ProgramPhase],
        });
        const programPartner = await ProgramPartner.findAll({
          where: { ProgramId },
          include: [Partner],
        });
        const programPriority = await ProgramPriority.findAll({
          where: { ProgramId },
          include: [Priority],
        });
        const programCommittee = await ProgramCommittee.findAll({
          where: { ProgramId },
          include: [Committee],
        });
        const result = {
          ...data1,
          ...data2,
          ProgramPartner: programPartner,
          ProgramPriority: programPriority,
          ProgramCommittee: programCommittee,
        };
        await redisPMO.set(
          `[ProgramDetail]ProgramId:${ProgramId}`,
          JSON.stringify(result, null, 2),
          { EX: 60 * 60 * 24 }
        );
        res.status(200).json(result);
      } else res.status(200).json(JSON.parse(redisCheck));
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      //       await redisPMO.disconnect();
      console.log("Redis closed");
    }
  }

  static async deleteProgram(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { ProgramId } = req.params;
      const result = await Program.destroy(
        {
          where: { id: ProgramId },
        },
        { transaction: t }
      );

      await ProgramVision.destroy(
        {
          where: { ProgramId },
        },
        { transaction: t }
      );
      await ProgramDriver.destroy(
        {
          where: { ProgramId },
        },
        { transaction: t }
      );
      await ProgramIndicator.destroy(
        {
          where: { ProgramId },
        },
        { transaction: t }
      );
      await ProgramPhase.destroy(
        {
          where: { ProgramId },
        },
        { transaction: t }
      );
      await ProgramCommittee.destroy(
        {
          where: { ProgramId },
        },
        { transaction: t }
      );
      await ProgramPartner.destroy(
        {
          where: { ProgramId },
        },
        { transaction: t }
      );
      await ProgramPriority.destroy(
        {
          where: { ProgramId },
        },
        { transaction: t }
      );
      await t.commit();
      await deleteRedisKeys(ProgramId);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  }
};
