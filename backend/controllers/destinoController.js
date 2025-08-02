const { Destino } = require('../models');

// Obtener todos los destinos (solo activos)
const getAllDestinos = async (req, res) => {
  try {
    const destinos = await Destino.findAll({
      order: [['created_at', 'DESC']],
      paranoid: true // Solo destinos no eliminados
    });

    res.json({
      success: true,
      data: destinos
    });

  } catch (error) {
    console.error('Error al obtener destinos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener destino por ID (solo activos)
const getDestinoById = async (req, res) => {
  try {
    const { id } = req.params;

    const destino = await Destino.findByPk(id, {
      paranoid: true // Solo destinos no eliminados
    });

    if (!destino) {
      return res.status(404).json({
        success: false,
        message: 'Destino no encontrado'
      });
    }

    res.json({
      success: true,
      data: destino
    });

  } catch (error) {
    console.error('Error al obtener destino:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo destino
const createDestino = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      razon_social, 
      codigo_postal, 
      calle, 
      num_ext, 
      num_int, 
      colonia, 
      delegacion, 
      estado, 
      telefono, 
      correo_electronico, 
      autorizacion_semarnat, 
      nombre_encargado, 
      cargo_encargado, 
      observaciones 
    } = req.body;

    // Verificar si el destino ya existe
    const existingDestino = await Destino.findOne({ where: { nombre } });
    if (existingDestino) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un destino con ese nombre'
      });
    }

    // Crear nuevo destino
    const newDestino = await Destino.create({
      nombre,
      descripcion,
      razon_social,
      codigo_postal,
      calle,
      num_ext,
      num_int,
      colonia,
      delegacion,
      estado,
      telefono,
      correo_electronico,
      autorizacion_semarnat,
      nombre_encargado,
      cargo_encargado,
      observaciones
    });

    res.status(201).json({
      success: true,
      message: 'Destino creado exitosamente',
      data: newDestino
    });

  } catch (error) {
    console.error('Error al crear destino:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar destino
const updateDestino = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      razon_social, 
      codigo_postal, 
      calle, 
      num_ext, 
      num_int, 
      colonia, 
      delegacion, 
      estado, 
      telefono, 
      correo_electronico, 
      autorizacion_semarnat, 
      nombre_encargado, 
      cargo_encargado, 
      observaciones 
    } = req.body;

    const destino = await Destino.findByPk(id, { paranoid: true });
    if (!destino) {
      return res.status(404).json({
        success: false,
        message: 'Destino no encontrado'
      });
    }

    // Verificar si el nombre ya existe en otro destino
    if (nombre && nombre !== destino.nombre) {
      const existingDestino = await Destino.findOne({ where: { nombre } });
      if (existingDestino) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un destino con ese nombre'
        });
      }
    }

    // Actualizar destino
    await destino.update({
      nombre: nombre || destino.nombre,
      descripcion: descripcion !== undefined ? descripcion : destino.descripcion,
      razon_social: razon_social || destino.razon_social,
      codigo_postal: codigo_postal || destino.codigo_postal,
      calle: calle || destino.calle,
      num_ext: num_ext || destino.num_ext,
      num_int: num_int !== undefined ? num_int : destino.num_int,
      colonia: colonia || destino.colonia,
      delegacion: delegacion || destino.delegacion,
      estado: estado || destino.estado,
      telefono: telefono || destino.telefono,
      correo_electronico: correo_electronico !== undefined ? correo_electronico : destino.correo_electronico,
      autorizacion_semarnat: autorizacion_semarnat || destino.autorizacion_semarnat,
      nombre_encargado: nombre_encargado !== undefined ? nombre_encargado : destino.nombre_encargado,
      cargo_encargado: cargo_encargado !== undefined ? cargo_encargado : destino.cargo_encargado,
      observaciones: observaciones !== undefined ? observaciones : destino.observaciones
    });

    res.json({
      success: true,
      message: 'Destino actualizado exitosamente',
      data: destino
    });

  } catch (error) {
    console.error('Error al actualizar destino:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar destino (baja lógica)
const deleteDestino = async (req, res) => {
  try {
    const { id } = req.params;

    const destino = await Destino.findByPk(id, { paranoid: true });
    if (!destino) {
      return res.status(404).json({
        success: false,
        message: 'Destino no encontrado'
      });
    }

    await destino.destroy(); // Soft delete

    res.json({
      success: true,
      message: 'Destino eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar destino:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Restaurar destino eliminado
const restoreDestino = async (req, res) => {
  try {
    const { id } = req.params;

    const destino = await Destino.findByPk(id, { paranoid: false });
    if (!destino) {
      return res.status(404).json({
        success: false,
        message: 'Destino no encontrado'
      });
    }

    if (!destino.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'El destino no está eliminado'
      });
    }

    await destino.restore();

    res.json({
      success: true,
      message: 'Destino restaurado exitosamente'
    });

  } catch (error) {
    console.error('Error al restaurar destino:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar destino permanentemente
const forceDeleteDestino = async (req, res) => {
  try {
    const { id } = req.params;

    const destino = await Destino.findByPk(id, { paranoid: false });
    if (!destino) {
      return res.status(404).json({
        success: false,
        message: 'Destino no encontrado'
      });
    }

    await destino.destroy({ force: true }); // Hard delete

    res.json({
      success: true,
      message: 'Destino eliminado permanentemente'
    });

  } catch (error) {
    console.error('Error al eliminar destino permanentemente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener destinos eliminados
const getDeletedDestinos = async (req, res) => {
  try {
    const destinos = await Destino.findAll({
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
      data: destinos
    });

  } catch (error) {
    console.error('Error al obtener destinos eliminados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllDestinos,
  getDestinoById,
  createDestino,
  updateDestino,
  deleteDestino,
  restoreDestino,
  forceDeleteDestino,
  getDeletedDestinos
}; 