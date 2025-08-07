'use strict';

const bcrypt = require('bcryptjs');
const config = require('../src/config/auth.config'); // adapte le chemin selon ton projet
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { User, Role } = require('../models'); // adapte le chemin si besoin

    try {
      // Données à insérer
      const usersData = [
        {
          lastName: "ADMIN",
          name: "ADMIN",
          mail: config.adminMail,
          password: bcrypt.hashSync(config.adminPassord, 8),
          timeAccess: 10000,
          roles: ["admin", "user"],
        },
      ];

      for (const data of usersData) {
        // Création ou récupération de l'utilisateur
        const [user, created] = await User.findOrCreate({
          where: { mail: data.mail },
          defaults: {
            lastName: data.lastName,
            name: data.name,
            password: data.password,
            timeAccess: data.timeAccess,
          },
        });

        // Récupération des rôles associés
        const userRoles = await Role.findAll({
          where: {
            name: {
              [Op.in]: data.roles,
            },
          },
        });

        // Association des rôles à l'utilisateur
        await user.setRoles(userRoles);
      }
    } catch (e) {
      console.error("Erreur lors de la création des utilisateurs : ", e.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const { User } = require('../models');
    await User.destroy({
      where: {
        mail: config.adminMail,
      },
    });
  },
};
