const { ManifiestoEstado, Manifiesto } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los estados de manifiestos (solo activos)
const getAllManifiestoEstados = async (req, res) => {
  try {
    const estados = await ManifiestoEstado.findAll({
      include: [
        {
          model: Manifiesto,
          as: 'manifiesto',
          attributes: ['id', 'numero_libro']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: estados
    });
  } catch (error) {
    console.error('Error al obtener estados de manifiestos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estado de manifiesto por ID
const getManifiestoEstadoById = async (req, res) => {
  try {
    const { id } = req.params;
    const estado = await ManifiestoEstado.findByPk(id, {
      include: [
        {
          model: Manifiesto,
          as: 'manifiesto',
          attributes: ['id', 'numero_libro']
        }
      ]
    });

    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado de manifiesto no encontrado'
      });
    }

    res.json({
      success: true,
      data: estado
    });
  } catch (error) {
    console.error('Error al obtener estado de manifiesto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear nuevo estado de manifiesto
const createManifiestoEstado = async (req, res) => {
  try {
    const { id_manifiesto, esta_capturado, esta_entregado } = req.body;

    // Verificar que el manifiesto existe
    const manifiesto = await Manifiesto.findByPk(id_manifiesto);
    if (!manifiesto) {
      return res.status(400).json({
        success: false,
        message: 'El manifiesto especificado no existe'
      });
    }

    // Verificar que no existe ya un estado para este manifiesto
    const estadoExistente = await ManifiestoEstado.findOne({
      where: { id_manifiesto }
    });

    if (estadoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un estado para este manifiesto'
      });
    }

    const nuevoEstado = await ManifiestoEstado.create({
      id_manifiesto,
      esta_capturado: esta_capturado || false,
      esta_entregado: esta_entregado || false
    });

    const estadoCreado = await ManifiestoEstado.findByPk(nuevoEstado.id, {
      include: [
        {
          model: Manifiesto,
          as: 'manifiesto',
          attributes: ['id', 'numero_libro']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Estado de manifiesto creado exitosamente',
      data: estadoCreado
    });
  } catch (error) {
    console.error('Error al crear estado de manifiesto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar estado de manifiesto
const updateManifiestoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { esta_capturado, esta_entregado } = req.body;

    const estado = await ManifiestoEstado.findByPk(id);
    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado de manifiesto no encontrado'
      });
    }

    await estado.update({
      esta_capturado: esta_capturado !== undefined ? esta_capturado : estado.esta_capturado,
      esta_entregado: esta_entregado !== undefined ? esta_entregado : estado.esta_entregado
    });

    const estadoActualizado = await ManifiestoEstado.findByPk(id, {
      include: [
        {
          model: Manifiesto,
          as: 'manifiesto',
          attributes: ['id', 'numero_libro']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Estado de manifiesto actualizado exitosamente',
      data: estadoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar estado de manifiesto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar estado de manifiesto (baja lógica)
const deleteManifiestoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const estado = await ManifiestoEstado.findByPk(id);

    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado de manifiesto no encontrado'
      });
    }

    await estado.destroy();

    res.json({
      success: true,
      message: 'Estado de manifiesto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar estado de manifiesto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Restaurar estado de manifiesto
const restoreManifiestoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const estado = await ManifiestoEstado.findByPk(id, { paranoid: false });

    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado de manifiesto no encontrado'
      });
    }

    if (!estado.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'El estado de manifiesto no está eliminado'
      });
    }

    await estado.restore();

    res.json({
      success: true,
      message: 'Estado de manifiesto restaurado exitosamente'
    });
  } catch (error) {
    console.error('Error al restaurar estado de manifiesto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminación permanente
const forceDeleteManifiestoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const estado = await ManifiestoEstado.findByPk(id, { paranoid: false });

    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado de manifiesto no encontrado'
      });
    }

    await estado.destroy({ force: true });

    res.json({
      success: true,
      message: 'Estado de manifiesto eliminado permanentemente'
    });
  } catch (error) {
    console.error('Error al eliminar permanentemente estado de manifiesto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estados de manifiestos eliminados
const getDeletedManifiestoEstados = async (req, res) => {
  try {
    const estados = await ManifiestoEstado.findAll({
      where: {
        deleted_at: {
          [Op.ne]: null
        }
      },
      include: [
        {
          model: Manifiesto,
          as: 'manifiesto',
          attributes: ['id', 'numero_libro']
        }
      ],
      order: [['deleted_at', 'DESC']]
    });

    res.json({
      success: true,
      data: estados
    });
  } catch (error) {
    console.error('Error al obtener estados de manifiestos eliminados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllManifiestoEstados,
  getManifiestoEstadoById,
  createManifiestoEstado,
  updateManifiestoEstado,
  deleteManifiestoEstado,
  restoreManifiestoEstado,
  forceDeleteManifiestoEstado,
  getDeletedManifiestoEstados
}; 