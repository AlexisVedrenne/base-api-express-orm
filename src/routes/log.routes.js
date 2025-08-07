// Importe les modules et les dépendances nécessaires
const { authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/log.controller");

const baseUrl = "/api/log";

module.exports = function (app) {
  app.get(
    `${baseUrl}/api`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.setHeader],
    controller.getAllApi
  );

  app.get(
    `${baseUrl}/system`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.setHeader],
    controller.getAllSystem
  );

  app.delete(
    `${baseUrl}/all`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.setHeader],
    controller.purgeAllLog
  );

  app.delete(
    `${baseUrl}`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.setHeader],
    controller.purgeLog
  );
};
