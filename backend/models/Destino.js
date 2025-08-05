'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Destino extends Model {
    static associate(models) {
      Destino.hasMany(models.Cliente, {
        foreignKey: 'id_destino',
        as: 'clientes'
      });
    }
  }
  Destino.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    razon_social: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    calle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    num_ext: {
      type: DataTypes.STRING,
      allowNull: true
    },
    num_int: {
      type: DataTypes.STRING,
      allowNull: true
    },
    colonia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delegacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correo_electronico: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    autorizacion_semarnat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre_encargado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cargo_encargado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Destino',
    tableName: 'destinos',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return Destino;
}; 