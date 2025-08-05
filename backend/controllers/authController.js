const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.id_role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    console.log('Login attempt:', { correo, contrasena: '***' });

    // Buscar usuario por correo
    const user = await User.findOne({
      where: { email: correo },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'nombre']
      }]
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(contrasena);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user);

    // Enviar respuesta sin contraseña
    const userResponse = {
      id: user.id,
      nombre_completo: `${user.nombre} ${user.apellido}`,
      correo: user.email,
      id_rol: user.id_role,
      rol: user.role
    };

    console.log('Sending response:', { success: true, user: userResponse.id });

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, id_rol } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email: correo } });
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
      nombre,
      apellido,
      email: correo,
      password: contrasena,
      id_role: id_rol
    });

    // Obtener usuario con rol
    const userWithRole = await User.findByPk(newUser.id, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'nombre']
      }]
    });

    // Generar token
    const token = generateToken(userWithRole);

    // Enviar respuesta sin contraseña
    const userResponse = {
      id: userWithRole.id,
      nombre_completo: `${userWithRole.nombre} ${userWithRole.apellido}`,
      correo: userWithRole.email,
      id_rol: userWithRole.id_role,
      rol: userWithRole.role
    };

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const userResponse = {
      id: user.id,
      nombre_completo: `${user.nombre} ${user.apellido}`,
      correo: user.email,
      id_rol: user.id_role,
      rol: user.role
    };

    res.json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login,
  register,
  getProfile
}; 