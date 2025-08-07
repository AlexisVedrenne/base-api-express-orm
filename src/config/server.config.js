// Import du module 'dotenv' pour la configuration des variables d'environnement
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });

// Export d'un objet contenant différentes valeurs récupérées depuis les variables d'environnement
module.exports = {
  host: process.env[`API_IP`],
  apiPort: process.env[`API_PORT`],
  keyName:process.env[`KEY_NAME`],
  certName:process.env[`CERT_NAME`],
  env:process.env[`SERV_ENV`]
};
