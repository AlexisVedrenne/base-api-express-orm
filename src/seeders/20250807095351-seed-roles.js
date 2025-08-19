'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = ['user', 'admin'];

    await Promise.all(
      roles.map(async (name) => {
        const [role, created] = await queryInterface.rawSelect(
          'Roles', 
          { where: { name } }, 
          ['id']
        ).then(id => {
          if (!id) {
            return queryInterface.bulkInsert('Roles', [{
              name,
              createdAt: new Date(),
              updatedAt: new Date()
            }], {});
          }
        });
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', {
      name: ['user', 'admin']
    }, {});
  }
};
