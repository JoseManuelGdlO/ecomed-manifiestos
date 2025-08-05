'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        nombre: 'admin',
        descripcion: 'Administrador del sistema con acceso completo',
        permisos: JSON.stringify([
          'users.read', 'users.create', 'users.update', 'users.delete',
          'roles.read', 'roles.create', 'roles.update', 'roles.delete',
          'clientes.read', 'clientes.create', 'clientes.update', 'clientes.delete',
          'manifiestos.read', 'manifiestos.create', 'manifiestos.update', 'manifiestos.delete',
          'residuos.read', 'residuos.create', 'residuos.update', 'residuos.delete',
          'destinos.read', 'destinos.create', 'destinos.update', 'destinos.delete',
          'vehiculos.read', 'vehiculos.create', 'vehiculos.update', 'vehiculos.delete',
          'transportistas.read', 'transportistas.create', 'transportistas.update', 'transportistas.delete'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'capturista',
        descripcion: 'Capturista con acceso limitado para crear y editar registros',
        permisos: JSON.stringify([
          'clientes.read', 'clientes.create', 'clientes.update',
          'manifiestos.read', 'manifiestos.create', 'manifiestos.update',
          'residuos.read',
          'destinos.read',
          'vehiculos.read',
          'transportistas.read'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
}; 