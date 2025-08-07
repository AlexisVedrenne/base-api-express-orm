// Import du module 'dotenv' pour la configuration des variables d'environnement
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });

// Export d'un objet contenant différentes valeurs récupérées depuis les variables d'environnement
module.exports = {
  secret: process.env[`SECRET`],
  adminPassord: process.env[`BASE_PASSWORD_ADMIN`],
  adminMail: process.env[`BASE_MAIL_ADMIN`],
};
