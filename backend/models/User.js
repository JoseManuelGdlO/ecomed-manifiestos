const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre_completo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.contrasena) {
        const salt = await bcrypt.genSalt(10);
        user.contrasena = await bcrypt.hash(user.contrasena, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('contrasena')) {
        const salt = await bcrypt.genSalt(10);
        user.contrasena = await bcrypt.hash(user.contrasena, salt);
      }
    }
  }
});

// Método para comparar contraseñas
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.contrasena);
};

module.exports = User; 