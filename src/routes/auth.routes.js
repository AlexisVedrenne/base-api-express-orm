// Importe les modules et les dépendances nécessaires
const { verifySignUp, authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/auth.controller");
const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Trop de tentatives de connexion. Réessaie dans une heure.",
  });
const baseUrl = "/api/auth";

module.exports = function (app) {
  app.post(
    `${baseUrl}/signup`,
    [
      authJwt.verifyToken,
      verifySignUp.checkPassword,
      authJwt.isAdministrateur,
      verifySignUp.checkDuplicateUserMail,
      verifySignUp.checkRolesExisted,
      logMiddleware.log,
    ],
    controller.signup
  );

  app.post(
    `${baseUrl}/password`,
    [logMiddleware.log],
    controller.resetPassword
  );
  app.put(
    `${baseUrl}/account`,
    [authJwt.verifyToken],
    controller.updateAccount
  );
  app.delete(
    `${baseUrl}/account`,
    [authJwt.verifyToken],
    controller.deleteAccount
  );

  app.post(
    `${baseUrl}/login`,
    [logMiddleware.log, loginLimiter],
    controller.login
  );
};
