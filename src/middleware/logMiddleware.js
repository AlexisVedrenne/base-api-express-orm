
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const logs = require("../services/log.js")

log = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  const { method, originalUrl, ip, body, headers } = req;
  const start = Date.now();
  // Capture des informations de la requête
  const logData = {
    method: method,
    uri: originalUrl,
    ipAddress: ip,
    statusCode: res.statusCode,
    requestBody: JSON.stringify(body),
  };

  // Récupérer le token depuis le header x-access-token
  const token = headers["x-access-token"];
  if (token) {
    try {
      const decoded = jwt.verify(token, config.secret);
      logData.userId = decoded.id;
    } catch (err) {
      console.error("Erreur de vérification du token JWT :", err);
      logData.userId = null;
    }
  } else {
    logData.userId = null;
  }

  // Capturer le temps de réponse
  res.on("finish", () => {
    const end = Date.now();
    logData.responseTime = end - start;
    logData.responseBody = res.statusMessage;
    logs.createLogApi("Requete API termine",logData)
  });

  next();
};

setHeader = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
};

const logMiddleware = {
  log: log,
  setHeader: setHeader,
};

module.exports = logMiddleware;
