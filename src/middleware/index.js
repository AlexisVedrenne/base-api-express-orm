// Importe le module d'authentification JWT
const authJwt = require("./authJwt");

// Importe le module de vérification de l'inscription (SignUp)
const verifySignUp = require("./verifySignUp");

const logMiddleware = require("./logMiddleware");

// Exporte les modules pour les utiliser dans d'autres parties de l'application
module.exports = {
  authJwt, // Module pour gérer l'authentification JWT
  verifySignUp, // Module pour vérifier l'inscription des utilisateurs
  logMiddleware,
};
