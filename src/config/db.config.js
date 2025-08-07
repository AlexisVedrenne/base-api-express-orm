// Import du module 'dotenv' pour la configuration des variables d'environnement
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });

// Export d'un objet contenant différentes valeurs de configuration récupérées depuis les variables d'environnement
module.exports = {
  // 'DB' est la valeur du nom de la base de données (clé: DEV_DB) provenant de la variable d'environnement
  DB: process.env[`DEV_DB`],

  // 'USER' est la valeur du nom d'user de la base de données (clé: DEV_USER) provenant de la variable d'environnement
  USER: process.env[`DEV_USER`],

  // 'PASSWORD' est la valeur du mot de passe de la base de données (clé: DEV_PASSWORD) provenant de la variable d'environnement
  PASSWORD: process.env[`DEV_PASSWORD`],

  // 'HOST' est la valeur de l'hôte ou de l'adresse du serveur de la base de données (clé: DEV_HOST) provenant de la variable d'environnement
  HOST: process.env[`DEV_HOST`],

  // 'PORT' est la valeur du port sur lequel la base de données est accessible (clé: DEV_PORT) provenant de la variable d'environnement
  PORT: process.env[`DEV_PORT`],

  // 'DIALECT' est la valeur du dialecte de la base de données (par exemple, 'mysql', 'postgres', etc.) (clé: DEV_DIALECT) provenant de la variable d'environnement
  DIALECT: process.env[`DEV_DIALECT`],
};
