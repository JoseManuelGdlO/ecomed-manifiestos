'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Agregar solo las columnas que faltan
    await queryInterface.addColumn('destinos', 'nombre_encargado', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('destinos', 'cargo_encargado', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Revertir cambios
    await queryInterface.removeColumn('destinos', 'nombre_encargado');
    await queryInterface.removeColumn('destinos', 'cargo_encargado');
  }
};
