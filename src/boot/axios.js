// Import du module Axios par défaut en tant que 'ax' depuis le package 'axios'
const { default: ax } = require("axios");
// Création d'une instance Axios appelée 'axios' avec la configuration spécifiée
const axios = ax.create({
  // URL de base pour toutes les requêtes HTTP effectuées avec cette instance Axios
  baseURL: config.baseUrl,

  // Délai d'attente maximum pour les requêtes (10 000 millisecondes, soit 10 secondes)
  timeout: 10000,
  // En-têtes de la requête HTTP
  headers: {
    "Content-Type": "application/json", // Type de contenu de la requête (JSON)
    Accept: "application/json",         // Type de contenu accepté dans la réponse (JSON)
  },
});

// Export de l'instance Axios configurée pour être utilisée ailleurs dans l'application
module.exports = axios;
