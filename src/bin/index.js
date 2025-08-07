/**
 * Module dependencies.
 */
const app = require("../../app.js"); // Votre application Express
const debug = require("debug")("api-therefore:server"); // Débogage
var https = require("https"); // Module HTTP de base
var http = require("http");
const sequelize = require("../services/sequelize.js");
const fs = require("fs");
const path = require("path");
const cron = require("../services/cron.js");
const config = require("../config/server.config.js");

const key = path.join(__dirname, "certs", config.keyName);
const cert = path.join(__dirname, "certs", config.certName);
const port = normalizePort(process.env.API_PORT); // Normalisation du port

function createServer() {
  if (config.env === "prod") {
  return https.createServer(
    {
      key: fs.readFileSync(key), // Charger le certificat PFX
      cert: fs.readFileSync(cert), // Mot de passe du .pfx
      },
      app
    );
  } else {
    return http.createServer(app);
  }
} 
/**
 * Écoute sur le port spécifié, sur toutes les interfaces réseau.
 */
const server = createServer();
server.listen(port); // Démarrage du serveur
server.on("error", onError); // Gestion des erreurs liées au serveur
server.on("listening", onListening); // Gestion de l'événement d'écoute

/**
 * Initialisation de la base de donnée
 */
sequelize.initBdd();
cron.initCron()

/**
 * Normalisation d'un port en un nombre, une chaîne de caractères ou "false".
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // Pipe nommé
    return val;
  }

  if (port >= 0) {
    // Numéro de port
    return port;
  }

  return false;
}

/**
 * Gestionnaire d'événement pour l'événement "error" du serveur HTTP.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // Gestion des erreurs spécifiques à l'écoute avec des messages explicites
  switch (error.code) {
    case "EACCES":
      console.error(bind + " nécessite des privilèges élevés");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " est déjà en cours d'utilisation");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Gestionnaire d'événement pour l'événement "listening" du serveur HTTP.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Écoute sur " + bind);
}
