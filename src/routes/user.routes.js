// Importe les modules et les dépendances nécessaires
const { authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/user.controller");

const baseUrl = "/api/user";

module.exports = function (app) {
  app.get(
    `${baseUrl}`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.log],
    controller.getAllApi
  );

  app.put(
    `${baseUrl}`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.log],
    controller.update
  );
  // Endpoint pour mettre à jour les informations d'un user
  // Requiert un token d'accès, avec des vérifications pour le rôle "administrateur"

  app.put(
    `${baseUrl}/password`,
    [logMiddleware.log],
    controller.updatePassword
  );

  app.get(
    `${baseUrl}/:id`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.log],
    controller.getOne
  );
  // Endpoint pour mettre à jour le mot de passe d'un user
  // Requiert un token d'accès, avec des vérifications pour le rôle "administrateur"

  app.delete(
    `${baseUrl}/:id`,
    [
      logMiddleware.setHeader,
      authJwt.verifyToken,
      authJwt.isAdministrateur,
      logMiddleware.log,
    ],
    controller.delete
  );
  // Endpoint pour supprimer un user
  // Requiert un token d'accès, avec des vérifications pour le rôle "administrateur"
};
