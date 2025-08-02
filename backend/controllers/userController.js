const { User, Role } = require('../models');

// Obtener todos los usuarios (solo activos)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['contrasena'] },
      order: [['created_at', 'DESC']],
      paranoid: true // Solo usuarios no eliminados
    });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener usuario por ID (solo activos)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['contrasena'] },
      paranoid: true // Solo usuarios no eliminados
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo usuario
const createUser = async (req, res) => {
  try {
    const { nombre_completo, correo, contrasena, id_rol } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Verificar si el rol existe
    const role = await Role.findByPk(id_rol);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'El rol especificado no existe'
      });
    }

    // Crear nuevo usuario
    const newUser = await User.create({
      nombre_completo,
      correo,
      contrasena,
      id_rol
    });

    // Obtener usuario con rol
    const userWithRole = await User.findByPk(newUser.id, {
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['contrasena'] }
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: userWithRole
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, correo, contrasena, id_rol } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el correo ya existe en otro usuario
    if (correo && correo !== user.correo) {
      const existingUser = await User.findOne({ where: { correo } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El correo electrónico ya está registrado'
        });
      }
    }

    // Verificar si el rol existe
    if (id_rol) {
      const role = await Role.findByPk(id_rol);
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'El rol especificado no existe'
        });
      }
    }

    // Actualizar usuario
    await user.update({
      nombre_completo: nombre_completo || user.nombre_completo,
      correo: correo || user.correo,
      contrasena: contrasena || user.contrasena,
      id_rol: id_rol || user.id_rol
    });

    // Obtener usuario actualizado con rol
    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['contrasena'] }
    });

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar usuario (baja lógica)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { paranoid: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.destroy(); // Soft delete

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Restaurar usuario eliminado
const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { paranoid: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!user.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'El usuario no está eliminado'
      });
    }

    await user.restore();

    res.json({
      success: true,
      message: 'Usuario restaurado exitosamente'
    });

  } catch (error) {
    console.error('Error al restaurar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar usuario permanentemente
const forceDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { paranoid: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.destroy({ force: true }); // Hard delete

    res.json({
      success: true,
      message: 'Usuario eliminado permanentemente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario permanentemente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener usuarios eliminados
const getDeletedUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['contrasena'] },
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
      data: users
    });

  } catch (error) {
    console.error('Error al obtener usuarios eliminados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  forceDeleteUser,
  getDeletedUsers
}; 