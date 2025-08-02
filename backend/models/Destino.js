const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Destino = sequelize.define('Destino', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  razon_social: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  codigo_postal: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 10]
    }
  },
  calle: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  num_ext: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 20]
    }
  },
  num_int: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: [0, 20]
    }
  },
  colonia: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  delegacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  estado: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 20]
    }
  },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true,
      len: [0, 100]
    }
  },
  autorizacion_semarnat: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  nombre_encargado: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100]
    }
  },
  cargo_encargado: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100]
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'destinos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

module.exports = Destino; 