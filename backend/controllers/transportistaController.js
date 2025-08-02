const { Transportista } = require('../models');

// Obtener todos los transportistas (solo activos)
const getAllTransportistas = async (req, res) => {
  try {
    const transportistas = await Transportista.findAll({
      order: [['created_at', 'DESC']],
      paranoid: true // Solo transportistas no eliminados
    });

    res.json({
      success: true,
      data: transportistas
    });

  } catch (error) {
    console.error('Error al obtener transportistas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener transportista por ID (solo activos)
const getTransportistaById = async (req, res) => {
  try {
    const { id } = req.params;

    const transportista = await Transportista.findByPk(id, {
      paranoid: true // Solo transportistas no eliminados
    });

    if (!transportista) {
      return res.status(404).json({
        success: false,
        message: 'Transportista no encontrado'
      });
    }

    res.json({
      success: true,
      data: transportista
    });

  } catch (error) {
    console.error('Error al obtener transportista:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo transportista
const createTransportista = async (req, res) => {
  try {
    const { 
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
      permiso_sct, 
      tipo_vehiculo, 
      placa, 
      ruta_empresa 
    } = req.body;

    // Verificar si el transportista ya existe (por placa)
    const existingTransportista = await Transportista.findOne({ where: { placa } });
    if (existingTransportista) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un transportista con esa placa'
      });
    }

    // Crear nuevo transportista
    const newTransportista = await Transportista.create({
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
      permiso_sct,
      tipo_vehiculo,
      placa,
      ruta_empresa
    });

    res.status(201).json({
      success: true,
      message: 'Transportista creado exitosamente',
      data: newTransportista
    });

  } catch (error) {
    console.error('Error al crear transportista:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar transportista
const updateTransportista = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
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
      permiso_sct, 
      tipo_vehiculo, 
      placa, 
      ruta_empresa 
    } = req.body;

    const transportista = await Transportista.findByPk(id, { paranoid: true });
    if (!transportista) {
      return res.status(404).json({
        success: false,
        message: 'Transportista no encontrado'
      });
    }

    // Verificar si la placa ya existe en otro transportista
    if (placa && placa !== transportista.placa) {
      const existingTransportista = await Transportista.findOne({ where: { placa } });
      if (existingTransportista) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un transportista con esa placa'
        });
      }
    }

    // Actualizar transportista
    await transportista.update({
      razon_social: razon_social || transportista.razon_social,
      codigo_postal: codigo_postal || transportista.codigo_postal,
      calle: calle || transportista.calle,
      num_ext: num_ext || transportista.num_ext,
      num_int: num_int !== undefined ? num_int : transportista.num_int,
      colonia: colonia || transportista.colonia,
      delegacion: delegacion || transportista.delegacion,
      estado: estado || transportista.estado,
      telefono: telefono || transportista.telefono,
      correo_electronico: correo_electronico !== undefined ? correo_electronico : transportista.correo_electronico,
      autorizacion_semarnat: autorizacion_semarnat || transportista.autorizacion_semarnat,
      permiso_sct: permiso_sct || transportista.permiso_sct,
      tipo_vehiculo: tipo_vehiculo || transportista.tipo_vehiculo,
      placa: placa || transportista.placa,
      ruta_empresa: ruta_empresa || transportista.ruta_empresa
    });

    res.json({
      success: true,
      message: 'Transportista actualizado exitosamente',
      data: transportista
    });

  } catch (error) {
    console.error('Error al actualizar transportista:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar transportista (baja lógica)
const deleteTransportista = async (req, res) => {
  try {
    const { id } = req.params;

    const transportista = await Transportista.findByPk(id, { paranoid: true });
    if (!transportista) {
      return res.status(404).json({
        success: false,
        message: 'Transportista no encontrado'
      });
    }

    await transportista.destroy(); // Soft delete

    res.json({
      success: true,
      message: 'Transportista eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar transportista:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Restaurar transportista eliminado
const restoreTransportista = async (req, res) => {
  try {
    const { id } = req.params;

    const transportista = await Transportista.findByPk(id, { paranoid: false });
    if (!transportista) {
      return res.status(404).json({
        success: false,
        message: 'Transportista no encontrado'
      });
    }

    if (!transportista.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'El transportista no está eliminado'
      });
    }

    await transportista.restore();

    res.json({
      success: true,
      message: 'Transportista restaurado exitosamente'
    });

  } catch (error) {
    console.error('Error al restaurar transportista:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar transportista permanentemente
const forceDeleteTransportista = async (req, res) => {
  try {
    const { id } = req.params;

    const transportista = await Transportista.findByPk(id, { paranoid: false });
    if (!transportista) {
      return res.status(404).json({
        success: false,
        message: 'Transportista no encontrado'
      });
    }

    await transportista.destroy({ force: true }); // Hard delete

    res.json({
      success: true,
      message: 'Transportista eliminado permanentemente'
    });

  } catch (error) {
    console.error('Error al eliminar transportista permanentemente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener transportistas eliminados
const getDeletedTransportistas = async (req, res) => {
  try {
    const transportistas = await Transportista.findAll({
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
      data: transportistas
    });

  } catch (error) {
    console.error('Error al obtener transportistas eliminados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllTransportistas,
  getTransportistaById,
  createTransportista,
  updateTransportista,
  deleteTransportista,
  restoreTransportista,
  forceDeleteTransportista,
  getDeletedTransportistas
}; 