// Importe le modèle de base de données (db) et les rôles (ROLES)
const { Role, User } = require('../models');

// Middleware pour vérifier si le nom d'user est déjà utilisé
checkDuplicateUserMail = (req, res, next) => {
  // Recherche dans la base de données un user avec le même nom
  if (req.body.user.mail) {
    User.findOne({
      where: {
        mail: req.body.user.mail,
      },
    })
      .then((user) => {
        if (user) {
          // Si un user avec le même nom est trouvé, renvoie une erreur 400
          res.status(400).send({
            message: "Failed! The user’s email is already used!",
          });
          return;
        }
        // Si aucun user avec le même nom n'est trouvé, passe à l'étape suivante
        next();
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Unable to verify user." });
      });
  } else {
    res.status(400).send({ message: "You must provide a mail." });
  }
};

// Middleware pour vérifier si les rôles existent
checkRolesExisted = (req, res, next) => {
  if (req.body.user.roles) {
    // Si des rôles sont fournis dans la requête
    for (let i = 0; i < req.body.user.roles.length; i++) {
      if (!Role.includes(req.body.user.roles[i])) {
        // Si le rôle n'existe pas dans la liste des rôles autorisés (ROLES)
        res.status(400).send({
          message: `Failed! The role ${req.body.user.roles[i]} does not exist `,
        });
        return;
      }
    }
  }

  // Si tous les rôles existent, passe à l'étape suivante
  next();
};

checkPassword = (req, res, next) => {
  if (req.body.user.password) {
    if (req.body.user.password.length < 6) {
      res.status(400).send({
        message: `The password must be at least 6 characters long.`,
      });
      return;
    }
    next();
  } else {
    res.status(400).send({ message: "You must provide a password." });
  }
};

// Module d'exportation contenant les middlewares de vérification
const verifySignUp = {
  checkDuplicateUserMail: checkDuplicateUserMail, // Vérification du nom d'user en double
  checkRolesExisted: checkRolesExisted, // Vérification de l'existence des rôles
  checkPassword: checkPassword,
};

module.exports = verifySignUp;
