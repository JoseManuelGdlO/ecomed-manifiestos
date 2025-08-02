const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  numero_registro_ambiental: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50]
    }
  },
  nombre_razon_social: {
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
    allowNull: true,
    validate: {
      len: [0, 20]
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true,
      len: [0, 100]
    }
  },
  zona: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  id_destino: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'destinos',
      key: 'id'
    },
    validate: {
      notNull: true
    }
  },
  id_transportista: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'transportistas',
      key: 'id'
    },
    validate: {
      notNull: true
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

module.exports = Cliente; 