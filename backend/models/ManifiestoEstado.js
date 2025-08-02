const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ManifiestoEstado = sequelize.define('ManifiestoEstado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_manifiesto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'manifiestos',
      key: 'id'
    },
    validate: {
      notNull: true
    }
  },
  esta_capturado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  esta_entregado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'manifiesto_estados',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

module.exports = ManifiestoEstado; 