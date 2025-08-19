const { LogSysteme, LogApi } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const pagination = require("../config/pagination.config");

exports.getAllLogApi = async (
  page = pagination.page,
  pageSize = pagination.min,
  search = ""
) => {
  try {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await LogApi.findAndCountAll({
      limit: pageSize,
      offset,
      where: {
        message: {
          [Op.iLike]: `%${search}%`,
        },
      },
    });
    return {
      totalItems: parseInt(count),
      totalPages: Math.ceil(parseInt(count) / parseInt(pageSize)),
      currentPage: parseInt(page),
      data: rows,
    };
  } catch (e) {
    const message = `Unable to retrieve logs. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "getAllLogApi");
    throw e;
  }
};

exports.getAllLogApiApi = async (req, res) => {
  try {
    res.send(
      await this.getAllLogApi(
        req.query.page,
        req.query.pageSize,
        req.query.search
      )
    );
  } catch (e) {
    res.status(500).send({ message: e });
  }
};

exports.getAllSystem = async (
  page = pagination.page,
  pageSize = pagination.min,
  search = ""
) => {
  try {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await LogSystem.findAndCountAll({
      limit: pageSize,
      offset,
      where: {
        message: {
          [Op.iLike]: `%${search}%`,
        },
      },
    });
    return {
      totalItems: parseInt(count),
      totalPages: Math.ceil(parseInt(count) / parseInt(pageSize)),
      currentPage: parseInt(page),
      data: rows,
    };
  } catch (e) {
    const message = `Unable to retrieve logs. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "getAllSystem");
    throw e;
  }
};

exports.getAllSystemApi = async (req, res) => {
  try {
    res.send(
      await this.getAllSystem(
        req.query.page,
        req.query.pageSize,
        req.query.search
      )
    );
  } catch (e) {
    res.status(500).send({ message: e });
  }
};

exports.purgeAllLog = async (req, res) => {
  try {
    await LogApi.destroy({
      where: {},
      truncate: true,
    });

    await LogSystem.destroy({
      where: {},
      truncate: true,
    });
    res.send({ message: "All the logs were cleared." });
  } catch (e) {
    const message = `Unable to clear the logs. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "purgeAllLog");
    res.status(500).send({ message: message });
  }
};

exports.purgeLogNoReq = async () => {
  try {
    const dateLimite = moment().subtract(30, "days").toDate();
    const deletedApi = await LogApi.destroy({
      where: {
        createdAt: {
          [Op.lt]: dateLimite,
        },
      },
      truncate: true,
    });

    const deletedSystem = await LogSystem.destroy({
      where: {
        createdAt: {
          [Op.lt]: dateLimite,
        },
      },
      truncate: true,
    });
    return `${deletedApi + deletedSystem} lines of logs deleted.`;
  } catch (e) {
    throw e;
  }
};

exports.purgeLog = async (req, res) => {
  try {
    const message = await this.purgeLogNoReq();
    res.send({ message: message });
  } catch (e) {
    const message = `Unable to purge the logs from the last 30 days. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "purgeLog");
    res.status(500).send({ message: message });
  }
};
