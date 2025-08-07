// Import du module 'dotenv' pour la configuration des variables d'environnement
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });

const mailerConfig = {
  mailjetKey: process.env[`MAILJET_KEY`],
  mailjetSecret: process.env[`MAILJET_SECRET`],
  redirectUrl: process.env[`REDIRECT_URL`],
  saveUrl:process.env[`SAVE_URL`],
  appName: process.env[`APP_NAME`],
};

module.exports = mailerConfig;
