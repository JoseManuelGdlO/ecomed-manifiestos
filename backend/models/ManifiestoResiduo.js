const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ManifiestoResiduo = sequelize.define('ManifiestoResiduo', {
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
  id_residuo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'residuos',
      key: 'id'
    },
    validate: {
      notNull: true
    }
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  unidad_medida: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'kg',
    validate: {
      notEmpty: true,
      len: [1, 20]
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'manifiesto_residuos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
  indexes: [
    {
      unique: true,
      fields: ['id_manifiesto', 'id_residuo']
    }
  ]
});

module.exports = ManifiestoResiduo; 