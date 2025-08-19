const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { User } = require('../models');

// Middleware pour vérifier si un token d'accès est fourni et s'il est valide
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "You must provide a token!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized resource!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// Middleware pour vérifier si l'user a le rôle d'administrateur
isAdministrateur = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({
          message: "Resource reserved for administrators.",
        });
        return;
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error: Token corrupted or unable to verify access role.",
      });
    });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdministrateur: isAdministrateur,
};
module.exports = authJwt;
