'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const capturistaPassword = await bcrypt.hash('capturista123', 10);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@ecomed.com',
        password: adminPassword,
        nombre: 'Administrador',
        apellido: 'Sistema',
        id_role: 1, // admin role
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'capturista@ecomed.com',
        password: capturistaPassword,
        nombre: 'Capturista',
        apellido: 'General',
        id_role: 2, // capturista role
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
}; 