const { Residuo } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los residuos (solo activos)
const getAllResiduos = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'asc', search = '' } = req.query;
    
    // Construir condiciones de búsqueda
    let whereClause = {};
    
    // Agregar búsqueda si se proporciona
    if (search && search.trim() !== '') {
      whereClause = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${search}%` } },
          { codigo: { [Op.like]: `%${search}%` } },
          { descripcion: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    // Calcular offset para paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir ordenamiento
    let orderClause = [[sort, order.toUpperCase()]];
    
    // Si el campo de ordenamiento es 'created_at', usar el nombre correcto de la columna
    if (sort === 'created_at') {
      orderClause = [['created_at', order.toUpperCase()]];
    }
    
    // Obtener total de registros para paginación
    const total = await Residuo.count({ 
      where: whereClause,
      paranoid: true 
    });
    
    // Obtener residuos con paginación, búsqueda y ordenamiento
    const residuos = await Residuo.findAll({
      where: whereClause,
      order: orderClause,
      limit: parseInt(limit),
      offset: offset,
      paranoid: true
    });

    res.json({
      success: true,
      data: residuos,
      total: total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });

  } catch (error) {
    console.error('Error al obtener residuos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener residuo por ID (solo activos)
const getResiduoById = async (req, res) => {
  try {
    const { id } = req.params;

    const residuo = await Residuo.findByPk(id, {
      paranoid: true // Solo residuos no eliminados
    });

    if (!residuo) {
      return res.status(404).json({
        success: false,
        message: 'Residuo no encontrado'
      });
    }

    res.json({
      success: true,
      data: residuo
    });

  } catch (error) {
    console.error('Error al obtener residuo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo residuo
const createResiduo = async (req, res) => {
  try {
    const { nombre, descripcion, codigo, peligroso } = req.body;

    // Verificar si el residuo ya existe por nombre
    const existingResiduo = await Residuo.findOne({ where: { nombre } });
    if (existingResiduo) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un residuo con ese nombre'
      });
    }

    // Verificar si el código ya existe (si se proporciona)
    if (codigo) {
      const existingCodigo = await Residuo.findOne({ where: { codigo } });
      if (existingCodigo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un residuo con ese código'
        });
      }
    }

    // Crear nuevo residuo
    const newResiduo = await Residuo.create({
      nombre,
      descripcion: descripcion || null,
      codigo: codigo || null,
      peligroso: peligroso || false
    });

    res.status(201).json({
      success: true,
      message: 'Residuo creado exitosamente',
      data: newResiduo
    });

  } catch (error) {
    console.error('Error al crear residuo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar residuo
const updateResiduo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, codigo, peligroso } = req.body;

    const residuo = await Residuo.findByPk(id, { paranoid: true });
    if (!residuo) {
      return res.status(404).json({
        success: false,
        message: 'Residuo no encontrado'
      });
    }

    // Verificar si el nombre ya existe en otro residuo
    if (nombre && nombre !== residuo.nombre) {
      const existingResiduo = await Residuo.findOne({ where: { nombre } });
      if (existingResiduo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un residuo con ese nombre'
        });
      }
    }

    // Verificar si el código ya existe en otro residuo (si se proporciona)
    if (codigo && codigo !== residuo.codigo) {
      const existingCodigo = await Residuo.findOne({ where: { codigo } });
      if (existingCodigo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un residuo con ese código'
        });
      }
    }

    // Actualizar residuo
    await residuo.update({
      nombre: nombre || residuo.nombre,
      descripcion: descripcion !== undefined ? descripcion : residuo.descripcion,
      codigo: codigo !== undefined ? codigo : residuo.codigo,
      peligroso: peligroso !== undefined ? peligroso : residuo.peligroso
    });

    res.json({
      success: true,
      message: 'Residuo actualizado exitosamente',
      data: residuo
    });

  } catch (error) {
    console.error('Error al actualizar residuo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar residuo (baja lógica)
const deleteResiduo = async (req, res) => {
  try {
    const { id } = req.params;

    const residuo = await Residuo.findByPk(id, { paranoid: true });
    if (!residuo) {
      return res.status(404).json({
        success: false,
        message: 'Residuo no encontrado'
      });
    }

    await residuo.destroy(); // Soft delete

    res.json({
      success: true,
      message: 'Residuo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar residuo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Restaurar residuo eliminado
const restoreResiduo = async (req, res) => {
  try {
    const { id } = req.params;

    const residuo = await Residuo.findByPk(id, { paranoid: false });
    if (!residuo) {
      return res.status(404).json({
        success: false,
        message: 'Residuo no encontrado'
      });
    }

    if (!residuo.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'El residuo no está eliminado'
      });
    }

    await residuo.restore();

    res.json({
      success: true,
      message: 'Residuo restaurado exitosamente'
    });

  } catch (error) {
    console.error('Error al restaurar residuo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar residuo permanentemente
const forceDeleteResiduo = async (req, res) => {
  try {
    const { id } = req.params;

    const residuo = await Residuo.findByPk(id, { paranoid: false });
    if (!residuo) {
      return res.status(404).json({
        success: false,
        message: 'Residuo no encontrado'
      });
    }

    await residuo.destroy({ force: true }); // Hard delete

    res.json({
      success: true,
      message: 'Residuo eliminado permanentemente'
    });

  } catch (error) {
    console.error('Error al eliminar residuo permanentemente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener residuos eliminados
const getDeletedResiduos = async (req, res) => {
  try {
    const residuos = await Residuo.findAll({
      order: [['deleted_at', 'DESC']],
      paranoid: false,
      where: {
        deleted_at: {
          [Op.ne]: null
        }
      }
    });

    res.json({
      success: true,
      data: residuos
    });

  } catch (error) {
    console.error('Error al obtener residuos eliminados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllResiduos,
  getResiduoById,
  createResiduo,
  updateResiduo,
  deleteResiduo,
  restoreResiduo,
  forceDeleteResiduo,
  getDeletedResiduos
}; 