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
  ProgramPartnerPosition,
  Priority,
  PartnerPosition,
  Position,
} = require("../models");
const { KADIN_ONLY } = require("../constants/ErrorKeys");

const { kadinIndonesia, expireRedis } = require("../constants/staticValue");
const { redisPMO, redisSearch } = require("../config/redis");
module.exports = class Controller {
  static async createProgram(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const {
        program,
        vision,
        partner,
        driver,
        indicator,
        phase,
        priority,
        PartnerPosition,
      } = req.body;

      if (!program.id) {
        const programRestored = await Program.restore({
          where: {
            [Op.and]: [
              { name: program.name },
              { PartnerId: program.PartnerId },
            ],
          },
        });
        const mainData = { createInfo: {} };
        if (!programRestored) {
          const result = await Program.create(
            {
              name: program.name,
              PartnerId: program.PartnerId,
              rapimnas: program.rapimnas,
            },
            {
              transaction: t,
            }
          );
          mainData.createInfo = result;
        } else {
          const result = await Program.findOne({
            where: {
              [Op.and]: [
                { name: program.name },
                { PartnerId: program.PartnerId },
              ],
            },
          });
          mainData.createInfo = result;
        }

        const { createInfo } = mainData;
        await ProgramVision.bulkCreate(
          vision
            .filter((el) => !el.deletedAt)
            .map((el) => {
              return { ...el, ProgramId: createInfo.id };
            }),
          { transaction: t }
        );
        await ProgramPartner.bulkCreate(
          partner
            .filter((el) => !el.deletedAt)
            .map((el) => {
              return { ...el, ProgramId: createInfo.id };
            }),
          { transaction: t }
        );
        await ProgramDriver.bulkCreate(
          driver
            .filter((el) => !el.deletedAt)
            .map((el) => {
              return { ...el, ProgramId: createInfo.id };
            }),
          { transaction: t }
        );
        await ProgramIndicator.bulkCreate(
          indicator
            .filter((el) => !el.deletedAt)
            .map((el) => {
              return { ...el, ProgramId: createInfo.id };
            }),
          { transaction: t }
        );
        await ProgramPhase.bulkCreate(
          phase
            .filter((el) => !el.deletedAt)
            .map((el) => {
              return { ...el, ProgramId: createInfo.id };
            }),
          { transaction: t }
        );
        await ProgramPriority.bulkCreate(
          priority
            .filter((el) => !el.deletedAt)
            .map((el) => {
              return { ...el, ProgramId: createInfo.id };
            }),
          { transaction: t }
        );
        await ProgramPartnerPosition.bulkCreate(
          PartnerPosition.filter((el) => !el.deletedAt).map((el) => {
            return {
              PartnerPositionId: el.id,
              ProgramId: createInfo.id,
            };
          }),
          { transaction: t }
        );
        await t.commit();
        res.status(200).json(`Program ${program.name} has been created!`);
      } else {
        await ProgramVision.bulkCreate(
          vision
            .map((el) => {
              return { ...el, updatedAt: new Date(), ProgramId: program.id };
            })
            .filter((el) => !(el.deletedAt && !el.id)),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "rapimnas",
              "ProgramId",
              "description",
              "updatedAt",
              "deletedAt",
            ],
          }
        );
        await ProgramPartner.bulkCreate(
          partner
            .map((el) => {
              return { ...el, updatedAt: new Date(), ProgramId: program.id };
            })
            .filter((el) => !(el.deletedAt && !el.id)),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "ProgramId",
              "PartnerId",
              "updatedAt",
              "deletedAt",
            ],
          }
        );
        await ProgramDriver.bulkCreate(
          driver
            .map((el) => {
              return { ...el, updatedAt: new Date(), ProgramId: program.id };
            })
            .filter((el) => !(el.deletedAt && !el.id)),
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
        await ProgramIndicator.bulkCreate(
          indicator
            .map((el) => {
              return { ...el, updatedAt: new Date(), ProgramId: program.id };
            })
            .filter((el) => !(el.deletedAt && !el.id)),
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
        await ProgramPhase.bulkCreate(
          phase
            .map((el) => {
              return { ...el, updatedAt: new Date(), ProgramId: program.id };
            })
            .filter((el) => !(el.deletedAt && !el.id)),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "ProgramId",
              "description",
              "quarter",
              "updatedAt",
              "deletedAt",
            ],
          }
        );
        await ProgramPriority.bulkCreate(
          priority
            .map((el) => {
              return { ...el, updatedAt: new Date(), ProgramId: program.id };
            })
            .filter((el) => !(el.deletedAt && !el.id)),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "ProgramId",
              "PriorityId",
              "updatedAt",
              "deletedAt",
            ],
          }
        );
        await ProgramPartnerPosition.bulkCreate(
          PartnerPosition.map((el) => {
            return {
              updatedAt: new Date(),
              ProgramId: program.id,
              PartnerPositionId: el.id,
            };
          }).filter((el) => !(el.deletedAt && !el.id)),
          {
            transaction: t,
            updateOnDuplicate: [
              "id",
              "ProgramId",
              "PartnerPositionId",
              "updatedAt",
              "deletedAt",
            ],
          }
        );
        await t.commit();

        res.status(200).json("update");
      }
    } catch (error) {
      console.log(error);
      await t.rollback();
      await next(error);
    }
  }

  static async programsByDepartmentId(req, res, next) {
    try {
      // await redisPMO.connect();
      const { id: PartnerId } = req.params;

      const result = await Program.findAll({
        where: { PartnerId },
        order: [["name", "asc"]],
      });
      // if (result.length > 0)

      await redisPMO.set(
        `[Program]PartnerId:${PartnerId}`,
        JSON.stringify(result, null, 2),
        { EX: expireRedis }
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async programDetail(req, res, next) {
    try {
      // await redisPMO.connect();

      const { id: ProgramId } = req.params;

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
      const programPartnerPosition = await PartnerPosition.findAll({
        include: [
          {
            model: ProgramPartnerPosition,
            where: { ProgramId },
            as: "ProgramCommittee",
          },
          {
            model: Position,
          },
          {
            model: Partner,
          },
        ],
        // include: [Position],
      });
      const result = {
        ...data1,
        ...data2,
        ProgramPartner: programPartner,
        ProgramPriority: programPriority,
        ProgramPartnerPosition: programPartnerPosition,
      };
      await redisPMO.set(
        `[ProgramDetail]ProgramId:${ProgramId}`,
        JSON.stringify(result, null, 2),
        { EX: expireRedis }
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
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
      await ProgramPartnerPosition.destroy(
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
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  }
};
