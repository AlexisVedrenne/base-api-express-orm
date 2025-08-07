"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Uuids", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
      },
      expiration: {
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true, // ou false selon ton besoin
        references: {
          model: "Users", // nom de la table (attention au 's')
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // ou 'CASCADE' si tu veux supprimer les UUIDs avec l'utilisateur
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Uuids");
  },
};
