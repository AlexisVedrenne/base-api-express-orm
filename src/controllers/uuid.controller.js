const { User, Uuid } = require('../models');
const { Op } = require('sequelize');
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const systemeService = require("../services/systeme");
const mailerConfig = require("../config/mailer.config")
const logs = require("../services/log")
const serverConfig = require("../config/server.config.js")

// Fonction pour trouver un uuid par son ID.
exports.findOneByUuid = async (uuid) => {
  try {
    const res = await Uuid.findOne({
      where: {
        uuid: {
          [Op.eq]: uuid,
        },
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (res) {
      return res;
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
};

// Fonction pour supprimer un uuid par son ID
exports.delete = async (uuid) => {
  try {
    await Uuid.destroy({
      where: {
        uuid: {
          [Op.eq]: uuid,
        },
      },
    });
    logs.createLogSysteme(`[LOG INFO] UUID ${uuid} deleted.`,"UUID delete")
  } catch (e) {
    const message = `Unable to delete the UUID. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "UUID delete");
    throw message
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const uuid = await this.findOneByUuid(req.params.uuid);
    if (uuid) {
      let params = uuid.user;
      const expiration = new Date(uuid.expiration).toLocaleString();
      params.expiration = expiration;
      params.uuid = uuid.uuid;
      params.saveUrl=`https://${serverConfig.host}:${serverConfig.apiPort}/${mailerConfig.saveUrl}`
      res.send(
        systemeService.importTemplate("UpdatePassword.page.html", params)
      );
    } else {
      res.status(400).send({ message: "Invalid UUID." });
    }
  } catch (e) {
    const message = `Unable to verify the uuid. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "uuid create");
    res.status(500).send({ message: message });
  }
};

// Fonction pour mettre à jour les informations d'un uuid.
exports.create = async (utilisateurId) => {
  try {
    const today = new Date();
    const uuid = await Uuid.create({
      uuid: uuidv4(),
      expiration: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    });
    await uuid.setUser(utilisateurId);
    logs.createLogSysteme(`UUID ${uuid.uuid} create for the user ID ${userId}.`,"uuid create")
    return uuid;
  } catch (e) {
    const message = `Unable to generate the UUID. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "uuid create");
    throw message
  }
};

exports.deleteOldUuid = async () => {
  try {
    const today = new Date();
    const uuids = await Uuid.destroy({
      where: {
        expiration: {
          [Op.lte]: today,
        },
      },
    });
    logs.createLogSysteme(`Removal of old ${uuids} uuid from the database.`,"deleteOldUuid")
  } catch (e) {
    const message = `Unable to delete old UUIDs. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "deleteOldUuid");
    throw message
  }
};
