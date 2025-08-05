'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Eliminar columnas existentes que no necesitamos
    await queryInterface.removeColumn('transportistas', 'rfc');
    await queryInterface.removeColumn('transportistas', 'direccion');
    await queryInterface.removeColumn('transportistas', 'email');
    await queryInterface.removeColumn('transportistas', 'id_vehiculo');

    // Agregar nuevas columnas
    await queryInterface.addColumn('transportistas', 'codigo_postal', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'calle', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'num_ext', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'num_int', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'colonia', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'delegacion', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'estado', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'correo_electronico', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'autorizacion_semarnat', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'permiso_sct', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'tipo_vehiculo', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'placa', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'ruta_empresa', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Revertir cambios
    await queryInterface.removeColumn('transportistas', 'codigo_postal');
    await queryInterface.removeColumn('transportistas', 'calle');
    await queryInterface.removeColumn('transportistas', 'num_ext');
    await queryInterface.removeColumn('transportistas', 'num_int');
    await queryInterface.removeColumn('transportistas', 'colonia');
    await queryInterface.removeColumn('transportistas', 'delegacion');
    await queryInterface.removeColumn('transportistas', 'estado');
    await queryInterface.removeColumn('transportistas', 'correo_electronico');
    await queryInterface.removeColumn('transportistas', 'autorizacion_semarnat');
    await queryInterface.removeColumn('transportistas', 'permiso_sct');
    await queryInterface.removeColumn('transportistas', 'tipo_vehiculo');
    await queryInterface.removeColumn('transportistas', 'placa');
    await queryInterface.removeColumn('transportistas', 'ruta_empresa');

    // Restaurar columnas originales
    await queryInterface.addColumn('transportistas', 'rfc', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'direccion', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('transportistas', 'id_vehiculo', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'vehiculos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
