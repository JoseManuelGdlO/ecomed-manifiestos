'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manifiesto extends Model {
    static associate(models) {
      Manifiesto.belongsTo(models.Cliente, {
        foreignKey: 'id_cliente',
        as: 'cliente'
      });
      Manifiesto.hasMany(models.ManifiestoResiduo, {
        foreignKey: 'id_manifiesto',
        as: 'manifiestoResiduos'
      });
      Manifiesto.hasMany(models.ManifiestoEstado, {
        foreignKey: 'id_manifiesto',
        as: 'manifiestoEstados'
      });
    }
  }
  Manifiesto.init({
    numero_libro: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fecha_transporte: {
      type: DataTypes.DATE,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Manifiesto',
    tableName: 'manifiestos',
    timestamps: true,
    paranoid: true
  });
  return Manifiesto;
}; 