const { User, Role,Uuid } = require('../../models');
const bcrypt = require("bcryptjs"); // Importe la bibliothèque bcrypt pour le hachage de mot de passe.
const { Op } = require('sequelize');
const controllerUuid = require("./uuid.controller");
const logs = require("../services/log");

// Fonction pour trouver un user par son ID.
exports.findOne = async (id) => {
  try {
    const user = await User.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (e) {

    throw e
  }
};

exports.findOneByMail = async (mail) => {
  try {
    const user = await User.findOne({
      where: {
        mail: {
          [Op.eq]: mail,
        },
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
};

// Fonction pour mettre à jour le mot de passe de l'user.
exports.updatePassword = async (req, res) => {
  try {
    const uuid = await controllerUuid.findOneByUuid(
      req.headers["x-access-uuid"]
    );
    if (uuid) {
      await User.update(
        {
          password: bcrypt.hashSync(req.body.password, 8),
        },
        {
          where: {
            id: {
              [Op.eq]: uuid.user.id,
            },
          },
        }
      );
      await Uuid.destroy({
        where: {
          id: {
            [Op.eq]: uuid.id,
          },
        },
      });
      res.send({ message: "Mot de passe utilisateur mis à jour." });
    } else {
      res
        .status(404)
        .send({ message: "UUID introuvable pour changer le mot de passe." });
    }
  } catch (e) {
    const message = `Impossible de mettre à jour le mot de passe. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "updatePassword");
    res.status(500).send({ message: message });
  }
};

// Fonction pour obtenir un user par son ID.
exports.getOne = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await this.findOne(id, res);
    if (user) {
      res.send(user);
    }
  } catch (err) {
    const message = `Erreur lors de la récupération de l'utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getOne");
    res.status(500).send({ message: message });
  }
};

// Fonction pour obtenir tous les utilisateurs (à l'exclusion du mot de passe).
exports.getAll = async (req, res) => {
  try {
    const result = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
    });
    res.send(result);
  } catch (e) {
    const message = `Impossible de récupérer la liste des utilisateurs.. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    res.status(500).send({ message: message });
  }
};

// Fonction pour supprimer un user par son ID
exports.delete = async (req, res) => {
  try {
    const user = await this.findOne(req.params.id, res);
    if (user) {
      await User.destroy({
        where: {
          id: {
            [Op.eq]: req.params.id,
          },
        },
      });
      res.send({ message: "Utilisateur supprimé." });
    } else {
      res.status(404).send({ message: "Utilisateur introuvable." });
    }
  } catch (e) {
    const message = `Impossible de supprimer l'utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "delete");
    res.status(500).send({ message: message });
  }
};

// Fonction pour mettre à jour les informations d'un user.
exports.update = async (req, res) => {
  try {
    const user = await this.findOne(req.body.user.id);
    delete req.body.user.password
    if (user) {
      await User.update(req.body.user, {
        where: {
          id: {
            [Op.eq]: user.id,
          },
        },
      });
      if (req.body.user.roles) {
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.user.roles,
            },
          },
        });
        await user.setRoles(roles).then(() => {
          res.send({ message: "Mise à jour réussite." });
        });
      } else {
        res.send({ message: "Mise à jour réussite." });
      }
    } else {
      res.status(404).send({ message: "Utilisateur introuvable." });
    }
  } catch (e) {
    const message = `Impossible de supprimer l'utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    res.status(500).send({ message: message });
  }
};
