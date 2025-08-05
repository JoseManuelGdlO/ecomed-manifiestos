'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ManifiestoEstado extends Model {
    static associate(models) {
      ManifiestoEstado.belongsTo(models.Manifiesto, {
        foreignKey: 'id_manifiesto',
        as: 'manifiesto'
      });
    }
  }
  ManifiestoEstado.init({
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_manifiesto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'manifiestos',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ManifiestoEstado',
    tableName: 'manifiesto_estados',
    timestamps: true,
    paranoid: true
  });
  return ManifiestoEstado;
}; 