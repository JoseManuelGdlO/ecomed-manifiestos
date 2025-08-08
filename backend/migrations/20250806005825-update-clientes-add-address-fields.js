'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add the missing address fields
    await queryInterface.addColumn('clientes', 'codigo_postal', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('clientes', 'calle', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('clientes', 'num_ext', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('clientes', 'num_int', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('clientes', 'colonia', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the added columns
    await queryInterface.removeColumn('clientes', 'codigo_postal');
    await queryInterface.removeColumn('clientes', 'calle');
    await queryInterface.removeColumn('clientes', 'num_ext');
    await queryInterface.removeColumn('clientes', 'num_int');
    await queryInterface.removeColumn('clientes', 'colonia');
  }
};
