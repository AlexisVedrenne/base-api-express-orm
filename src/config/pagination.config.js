const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });

// Export d'un objet contenant différentes valeurs récupérées depuis les variables d'environnement
module.exports = {
  min: process.env[`PAGE_MIN`],
  page :process.env[`PAGE_DEFAULT`],
};
