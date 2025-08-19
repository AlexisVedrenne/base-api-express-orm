const { User, Role, Uuid } = require("../models");
const bcrypt = require("bcryptjs"); // Importe la bibliothèque bcrypt pour le hachage de mot de passe.
const { Op } = require("sequelize");
const controllerUuid = require("./uuid.controller");
const logs = require("../services/log");
const pagination = require("../config/pagination.config");

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
    throw e;
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
      res.send({ message: "Updated user password." });
    } else {
      res
        .status(404)
        .send({ message: "UUID not found to change the password." });
    }
  } catch (e) {
    const message = `Unable to update the password. Detail : ${e.message}`;
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
    const message = `Error while retrieving the user. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "getOne");
    res.status(500).send({ message: message });
  }
};

// Fonction pour obtenir tous les utilisateurs (à l'exclusion du mot de passe).
exports.getAll = async (
  page = pagination.page,
  pageSize = pagination.min,
  search = ""
) => {
  try {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await User.findAndCountAll({
      limit: pageSize,
      offset,
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
      where: {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["name", "ASC"]],
    });
    return {
      totalItems: parseInt(count),
      totalPages: Math.ceil(parseInt(count) / parseInt(pageSize)),
      currentPage: parseInt(page),
      data: rows,
    };
  } catch (e) {
    const message = `Unable to retrieve the list of users. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    throw message;
  }
};

exports.getAllApi = async (req, res) => {
  try {
    res.send(
      await this.getAll(req.query.page, req.query.pageSize, req.query.search)
    );
  } catch (e) {
    res.status(500).send({ message: e });
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
      res.send({ message: "User deleted." });
    } else {
      res.status(404).send({ message: "User not found." });
    }
  } catch (e) {
    const message = `Unable to delete user. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "delete");
    res.status(500).send({ message: message });
  }
};

// Fonction pour mettre à jour les informations d'un user.
exports.update = async (req, res) => {
  try {
    const user = await this.findOne(req.body.user.id);
    delete req.body.user.password;
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
          res.send({ message: "Update success." });
        });
      } else {
        res.send({ message: "Update success." });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (e) {
    const message = `Unable to delete user. Detail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    res.status(500).send({ message: message });
  }
};
