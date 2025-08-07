const { LogSysteme, LogApi } = require('../../models');
const moment = require("moment");
const { Op } = require("sequelize");

exports.getAllApi = async (req, res) => {
  try {
    const logs = await LogApi.findAll();
    res.send(logs);
  } catch (e) {
    const message = `Impossible de récupérer les logs. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAllApi");
    res.status(500).send({ message: message });
  }
};

exports.getAllSystem = async (req, res) => {
  try {
    const logs = await LogSystem.findAll();
    res.send(logs);
  } catch (e) {
    const message = `Impossible de récupérer les logs. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAllSystem");
    res.status(500).send({ message: message });
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
    res.send({ message: "Tous les logs on était vidé." });
  } catch (e) {
    const message = `Impossible de vider les logs. Détail : ${e.message}`;
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
    return `${deletedApi + deletedSystem} lignes de logs supprimées.`;
  } catch (e) {
    throw e;
  }
};

exports.purgeLog = async (req, res) => {
  try {
    const message = await this.purgeLogNoReq();
    res.send({ message: message });
  } catch (e) {
    const message = `Impossible de purger les logs des 30 derniers jours. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "purgeLog");
    res.status(500).send({ message: message });
  }
};
