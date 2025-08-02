const { Vehiculo } = require('../models');

// Obtener todos los vehículos (solo activos)
const getAllVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll({
      order: [['created_at', 'DESC']],
      paranoid: true // Solo vehículos no eliminados
    });

    res.json({
      success: true,
      data: vehiculos
    });

  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener vehículo por ID (solo activos)
const getVehiculoById = async (req, res) => {
  try {
    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id, {
      paranoid: true // Solo vehículos no eliminados
    });

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    res.json({
      success: true,
      data: vehiculo
    });

  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo vehículo
const createVehiculo = async (req, res) => {
  try {
    const { marca, nombre, descripcion, placa } = req.body;

    // Verificar si el vehículo ya existe (por placa si se proporciona)
    if (placa) {
      const existingVehiculo = await Vehiculo.findOne({ where: { placa } });
      if (existingVehiculo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un vehículo con esa placa'
        });
      }
    }

    // Crear nuevo vehículo
    const newVehiculo = await Vehiculo.create({
      marca,
      nombre,
      descripcion,
      placa
    });

    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: newVehiculo
    });

  } catch (error) {
    console.error('Error al crear vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar vehículo
const updateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, nombre, descripcion, placa } = req.body;

    const vehiculo = await Vehiculo.findByPk(id, { paranoid: true });
    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar si la placa ya existe en otro vehículo
    if (placa && placa !== vehiculo.placa) {
      const existingVehiculo = await Vehiculo.findOne({ where: { placa } });
      if (existingVehiculo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un vehículo con esa placa'
        });
      }
    }

    // Actualizar vehículo
    await vehiculo.update({
      marca: marca || vehiculo.marca,
      nombre: nombre || vehiculo.nombre,
      descripcion: descripcion !== undefined ? descripcion : vehiculo.descripcion,
      placa: placa !== undefined ? placa : vehiculo.placa
    });

    res.json({
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: vehiculo
    });

  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar vehículo (baja lógica)
const deleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id, { paranoid: true });
    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    await vehiculo.destroy(); // Soft delete

    res.json({
      success: true,
      message: 'Vehículo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Restaurar vehículo eliminado
const restoreVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id, { paranoid: false });
    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    if (!vehiculo.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'El vehículo no está eliminado'
      });
    }

    await vehiculo.restore();

    res.json({
      success: true,
      message: 'Vehículo restaurado exitosamente'
    });

  } catch (error) {
    console.error('Error al restaurar vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar vehículo permanentemente
const forceDeleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id, { paranoid: false });
    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    await vehiculo.destroy({ force: true }); // Hard delete

    res.json({
      success: true,
      message: 'Vehículo eliminado permanentemente'
    });

  } catch (error) {
    console.error('Error al eliminar vehículo permanentemente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener vehículos eliminados
const getDeletedVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll({
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
      data: vehiculos
    });

  } catch (error) {
    console.error('Error al obtener vehículos eliminados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
  restoreVehiculo,
  forceDeleteVehiculo,
  getDeletedVehiculos
}; 