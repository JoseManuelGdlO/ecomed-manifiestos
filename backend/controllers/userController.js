const { User, Role } = require('../models');

// Obtener todos los usuarios (solo activos)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'asc', search = '' } = req.query;

    let whereClause = {};

    if (search && search.trim() !== '') {
      whereClause = {
        [require('sequelize').Op.or]: [
          { nombre: { [require('sequelize').Op.like]: `%${search}%` } },
          { apellido: { [require('sequelize').Op.like]: `%${search}%` } },
          { email: { [require('sequelize').Op.like]: `%${search}%` } }
        ]
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let orderClause = [[sort, order.toUpperCase()]];
    if (sort === 'created_at') {
      orderClause = [['created_at', order.toUpperCase()]];
    }

    const total = await User.count({
      where: whereClause,
      paranoid: true
    });

    const users = await User.findAll({
      where: whereClause,
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['password'] },
      order: orderClause,
      limit: parseInt(limit),
      offset: offset,
      paranoid: true // Solo usuarios no eliminados
    });

    res.json({
      success: true,
      data: users,
      total: total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
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
        as: 'role',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['password'] },
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
    const { nombre, apellido, email, password, id_role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Verificar si el rol existe
    const role = await Role.findByPk(id_role);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'El rol especificado no existe'
      });
    }

    // Crear nuevo usuario
    const newUser = await User.create({
      nombre,
      apellido,
      email,
      password,
      id_role
    });

    // Obtener usuario con rol
    const userWithRole = await User.findByPk(newUser.id, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['password'] }
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
    const { nombre, apellido, email, password, id_role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el correo ya existe en otro usuario
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El correo electrónico ya está registrado'
        });
      }
    }

    // Verificar si el rol existe
    if (id_role) {
      const role = await Role.findByPk(id_role);
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'El rol especificado no existe'
        });
      }
    }

    // Actualizar usuario
    await user.update({
      nombre: nombre || user.nombre,
      apellido: apellido || user.apellido,
      email: email || user.email,
      password: password || user.password,
      id_role: id_role || user.id_role
    });

    // Obtener usuario actualizado con rol
    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['password'] }
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
        as: 'role',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['password'] },
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