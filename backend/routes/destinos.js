const express = require('express');
const router = express.Router();
const destinoController = require('../controllers/destinoController');
const { validateDestino } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

// GET /api/destinos - Obtener todos los destinos activos (requiere autenticación)
router.get('/', auth, destinoController.getAllDestinos);

// GET /api/destinos/deleted - Obtener destinos eliminados (requiere autenticación y rol admin)
router.get('/deleted', auth, checkRole(['admin']), destinoController.getDeletedDestinos);

// GET /api/destinos/:id - Obtener destino por ID (requiere autenticación)
router.get('/:id', auth, destinoController.getDestinoById);

// POST /api/destinos - Crear nuevo destino (requiere autenticación y rol admin)
router.post('/', auth, checkRole(['admin']), validateDestino, destinoController.createDestino);

// PUT /api/destinos/:id - Actualizar destino (requiere autenticación y rol admin)
router.put('/:id', auth, checkRole(['admin']), validateDestino, destinoController.updateDestino);

// DELETE /api/destinos/:id - Eliminar destino (baja lógica, requiere autenticación y rol admin)
router.delete('/:id', auth, checkRole(['admin']), destinoController.deleteDestino);

// PATCH /api/destinos/:id/restore - Restaurar destino eliminado (requiere autenticación y rol admin)
router.patch('/:id/restore', auth, checkRole(['admin']), destinoController.restoreDestino);

// DELETE /api/destinos/:id/force - Eliminar destino permanentemente (requiere autenticación y rol admin)
router.delete('/:id/force', auth, checkRole(['admin']), destinoController.forceDeleteDestino);

module.exports = router; 