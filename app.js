// Importe le module Express pour créer l'application
const express = require("express");
const cookieParser = require("cookie-parser"); // Middleware pour gérer les cookies
const helmet = require("helmet"); // Middleware pour sécuriser l'application
const rateLimit = require("express-rate-limit");
// Importe le module Morgan pour la journalisation des requêtes HTTP
const logger = require("morgan");
const cors = require("cors"); // Middleware pour gérer les requêtes CORS
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Crée une instance d'application Express
const app = express();

const port = normalizePort(process.env.API_PORT); // Normalisation du port
app.set("port", port); // Configuration du port de l'application
app.use(express.json()); // Middleware pour traiter les données JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour traiter les données de formulaire
app.use(cookieParser()); // Middleware pour gérer les cookies
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      imgSrc: [
        "'self'",
        "data:",
        "https://cdn.img.avhost.dev/",
        "https://cdn-icons-png.flaticon.com/",
      ],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "Trop de requêtes. Réessaie dans quelques minutes.",
  })
);
// Utilise le middleware pour analyser le corps des requêtes au format JSON
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
// Utilise le middleware Morgan avec le format de journal "dev" pour afficher les journaux de développement dans la console

app.use(logger("dev"));
const allowedOrigins = [
  "http://localhost:9000",
  // Ajoute d'autres domaines ici
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origin (ex: curl, mobile, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-access-token"],
    credentials: false,
  })
);
// ✅ Optionnel mais utile pour les préflights
app.options("*", cors());

// Importe et utilise les routes des différents modules
require("./src/routes/auth.routes")(app); // Routes pour l'authentification
require("./src/routes/user.routes")(app); // Routes pour les utilisateurs
require("./src/routes/log.routes")(app);
require("./src/routes/uuid.routes")(app)


// Exporte l'application Express configurée
module.exports = app;
