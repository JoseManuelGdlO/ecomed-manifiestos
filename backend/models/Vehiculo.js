'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehiculo extends Model {
    static associate(models) {
      // La asociación con Transportista se eliminó ya que ahora los transportistas
      // tienen sus propios campos de vehículo (tipo_vehiculo, placa)
    }
  }
  Vehiculo.init({
    placa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    capacidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Vehiculo',
    tableName: 'vehiculos',
    timestamps: true,
    paranoid: true
  });
  return Vehiculo;
}; 