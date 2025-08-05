'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Residuo extends Model {
    static associate(models) {
      Residuo.hasMany(models.ManifiestoResiduo, {
        foreignKey: 'id_residuo',
        as: 'manifiestoResiduos'
      });
    }
  }
  Residuo.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    peligroso: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Residuo',
    tableName: 'residuos',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return Residuo;
}; 