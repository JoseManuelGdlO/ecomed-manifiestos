'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    static associate(models) {
      Cliente.belongsTo(models.Destino, {
        foreignKey: 'id_destino',
        as: 'destino'
      });
      Cliente.belongsTo(models.Transportista, {
        foreignKey: 'id_transportista',
        as: 'transportista'
      });
      Cliente.hasMany(models.Manifiesto, {
        foreignKey: 'id_cliente',
        as: 'manifiestos'
      });
    }
  }
  Cliente.init({
    numero_registro_ambiental: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nombre_razon_social: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rfc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    zona: {
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
    id_destino: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'destinos',
        key: 'id'
      }
    },
    id_transportista: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transportistas',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true,
    paranoid: true
  });
  return Cliente;
}; 