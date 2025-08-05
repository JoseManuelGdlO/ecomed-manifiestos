const { Role, User } = require('../models');

// Obtener todos los roles (solo activos)
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'nombre', 'apellido', 'email']
      }],
      order: [['created_at', 'DESC']],
      paranoid: true // Solo roles no eliminados
    });

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener rol por ID (solo activos)
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'nombre', 'apellido', 'email']
      }],
      paranoid: true // Solo roles no eliminados
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    res.json({
      success: true,
      data: role
    });

  } catch (error) {
    console.error('Error al obtener rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo rol
const createRole = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Verificar si el rol ya existe
    const existingRole = await Role.findOne({ where: { nombre } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del rol ya existe'
      });
    }

    // Crear nuevo rol
    const newRole = await Role.create({ nombre });

    res.status(201).json({
      success: true,
      message: 'Rol creado exitosamente',
      data: newRole
    });

  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar rol
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    // Verificar si el nombre ya existe en otro rol
    if (nombre && nombre !== role.nombre) {
      const existingRole = await Role.findOne({ where: { nombre } });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del rol ya existe'
        });
      }
    }

    // Actualizar rol
    await role.update({ nombre });

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: role
    });

  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar rol (baja lógica)
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, { paranoid: true });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    // Verificar si hay usuarios usando este rol
    const usersWithRole = await User.count({ 
      where: { id_role: id },
      paranoid: true // Solo usuarios activos
    });
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el rol porque ${usersWithRole} usuario(s) lo están usando`
      });
    }

    await role.destroy(); // Soft delete

    res.json({
      success: true,
      message: 'Rol eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Restaurar rol eliminado
const restoreRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, { paranoid: false });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    if (!role.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'El rol no está eliminado'
      });
    }

    await role.restore();

    res.json({
      success: true,
      message: 'Rol restaurado exitosamente'
    });

  } catch (error) {
    console.error('Error al restaurar rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar rol permanentemente
const forceDeleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, { paranoid: false });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    // Verificar si hay usuarios usando este rol (incluyendo eliminados)
    const usersWithRole = await User.count({ 
      where: { id_role: id },
      paranoid: false
    });
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar permanentemente el rol porque ${usersWithRole} usuario(s) lo están usando`
      });
    }

    await role.destroy({ force: true }); // Hard delete

    res.json({
      success: true,
      message: 'Rol eliminado permanentemente'
    });

  } catch (error) {
    console.error('Error al eliminar rol permanentemente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener roles eliminados
const getDeletedRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'nombre', 'apellido', 'email']
      }],
      order: [['deleted_at', 'DESC']],
      paranoid: false,
      where: {
        deleted_at: {
          [require('sequelize').Op.ne]: null
        }
      }
    });

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error('Error al obtener roles eliminados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  restoreRole,
  forceDeleteRole,
  getDeletedRoles
}; 