'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero_registro_ambiental: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nombre_razon_social: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rfc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      direccion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      zona: {
        type: Sequelize.STRING,
        allowNull: true
      },
      delegacion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: true
      },
      id_destino: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'destinos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_transportista: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transportistas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('clientes');
  }
};
