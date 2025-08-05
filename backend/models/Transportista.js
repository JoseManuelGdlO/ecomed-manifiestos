'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transportista extends Model {
    static associate(models) {
      Transportista.hasMany(models.Cliente, {
        foreignKey: 'id_transportista',
        as: 'clientes'
      });
    }
  }
  Transportista.init({
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
    permiso_sct: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipo_vehiculo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    placa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ruta_empresa: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Transportista',
    tableName: 'transportistas',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return Transportista;
}; 