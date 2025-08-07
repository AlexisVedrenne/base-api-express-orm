const config = require("../config/auth.config");
const { User, Role } = require('../../models');
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuidController = require("./uuid.controller");
const utilisateurController = require("./user.controller");
const mailerService = require("../services/mailer");
const logs = require("../services/log");

exports.resetPassword = async (req, res) => {
  try {
    const user = await utilisateurController.findOneByMail(req.body.mail);
    const uuid = await uuidController.create(user.id);
    await mailerService.sendResetPassword(user, uuid);
    const message = `Lien envoyé à ${user.mail}.`;
    logs.createLogSysteme(message, "resetPassword");
    res.send({ message: message });
  } catch (e) {
    const message = `Impossible d'envoyer le lien. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "resetPassword");
    res.status(500).send({ message: message });
  }
};

exports.signup = async (req, res) => {
  try {
    const mdp = bcrypt.hashSync(req.body.user.password, 8);
    let user = req.body.user;
    user.password = mdp;
    user.timeAccess = 20000;
    const rolesToAdd = req.body.user.roles;
    const newUser = await User.create(user);
    if (rolesToAdd) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: rolesToAdd,
          },
        },
      });
      await newUser.setRoles(roles);
      res.send({
        message: `Utilisateur ${newUser.lastName} ${newUser.name} est bien enregistré !`,
      });
    } else {
      await newUser.setRoles([1]);
      res.send({
        message: `Utilisateur ${newUser.lastName} ${newUser.name} est bien enregistré !`,
      });
    }
  } catch (e) {
    const message = `Impossible d'envoyer le lien. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "resetPasingupssword");
    res.status(500).send({ message: message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        mail: req.body.mail,
      },
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
    });
    if (user) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (passwordIsValid) {
        const token = jwt.sign({ id: user.id }, config.secret, {
          algorithm: "HS256",
          allowInsecureKeySizes: false,
          expiresIn: user.timeAccess,
        });
        const date = new Date();
        await User.update(
          { lastLogin: date.toLocaleString() },
          {
            where: {
              id: {
                [Op.eq]: user.id,
              },
            },
          }
        );
        const userLogin = await User.findOne({
          attributes: [
            "id",
            "lastName",
            "name",
            "mail",
            "lastLogin",
            "imageUrl",
            "imageName",
          ],
          where: {
            mail: req.body.mail,
          },
          include: [
            {
              model: Role,
              as: "roles",
            },
          ],
        });
        res.send({
          accessToken: token,
          user: userLogin,
        });
      } else {
        res.status(401).send({
          accessToken: null,
          message: "Mot de passe invalide.",
        });
      }
    } else {
      res.status(404).send({ message: "Utilisateur introuvable." });
    }
  } catch (e) {
    const message = `Impossible de se connecter. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "login");
    res.status(500).send({ message: message });
  }
};

// Fonction pour modifier les informations du compte utilisateur
exports.updateAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, lastName, mail, imageName, imageUrl } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." });
    }
    await user.update({ name, lastName, mail, imageName, imageUrl });
    const newUser = await User.findOne({
      attributes: [
        "id",
        "lastName",
        "name",
        "mail",
        "lastLogin",
        "imageUrl",
        "imageName",
      ],
      where: {
        id: userId,
      },
    });
    res.send({
      message: "Informations du compte mises à jour avec succès.",
      user: newUser,
    });
  } catch (e) {
    const message = `Impossible de mettre à jour le compte utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "updateAccount");
    res.status(500).send({ message });
  }
};

// Fonction pour supprimer le compte utilisateur connecté
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." });
    }
    await user.destroy();
    res.send({ message: "Compte utilisateur supprimé avec succès." });
  } catch (e) {
    const message = `Impossible de supprimer le compte utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "deleteAccount");
    res.status(500).send({ message });
  }
};
