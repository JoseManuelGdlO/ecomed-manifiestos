const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const { validateVehiculo } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

// GET /api/vehiculos - Obtener todos los vehículos activos (requiere autenticación)
router.get('/', auth, vehiculoController.getAllVehiculos);

// GET /api/vehiculos/deleted - Obtener vehículos eliminados (requiere autenticación y rol admin)
router.get('/deleted', auth, checkRole(['admin']), vehiculoController.getDeletedVehiculos);

// GET /api/vehiculos/:id - Obtener vehículo por ID (requiere autenticación)
router.get('/:id', auth, vehiculoController.getVehiculoById);

// POST /api/vehiculos - Crear nuevo vehículo (requiere autenticación y rol admin)
router.post('/', auth, checkRole(['admin']), validateVehiculo, vehiculoController.createVehiculo);

// PUT /api/vehiculos/:id - Actualizar vehículo (requiere autenticación y rol admin)
router.put('/:id', auth, checkRole(['admin']), validateVehiculo, vehiculoController.updateVehiculo);

// DELETE /api/vehiculos/:id - Eliminar vehículo (baja lógica, requiere autenticación y rol admin)
router.delete('/:id', auth, checkRole(['admin']), vehiculoController.deleteVehiculo);

// PATCH /api/vehiculos/:id/restore - Restaurar vehículo eliminado (requiere autenticación y rol admin)
router.patch('/:id/restore', auth, checkRole(['admin']), vehiculoController.restoreVehiculo);

// DELETE /api/vehiculos/:id/force - Eliminar vehículo permanentemente (requiere autenticación y rol admin)
router.delete('/:id/force', auth, checkRole(['admin']), vehiculoController.forceDeleteVehiculo);

module.exports = router; 