'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ManifiestoResiduo extends Model {
    static associate(models) {
      ManifiestoResiduo.belongsTo(models.Manifiesto, {
        foreignKey: 'id_manifiesto',
        as: 'manifiesto'
      });
      ManifiestoResiduo.belongsTo(models.Residuo, {
        foreignKey: 'id_residuo',
        as: 'residuo'
      });
    }
  }
  ManifiestoResiduo.init({
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unidad: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
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
    },
    id_residuo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'residuos',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ManifiestoResiduo',
    tableName: 'manifiesto_residuos',
    timestamps: true,
    paranoid: true
  });
  return ManifiestoResiduo;
}; 