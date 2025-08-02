const express = require('express');
const router = express.Router();
const transportistaController = require('../controllers/transportistaController');
const { validateTransportista } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

// GET /api/transportistas - Obtener todos los transportistas activos (requiere autenticación)
router.get('/', auth, transportistaController.getAllTransportistas);

// GET /api/transportistas/deleted - Obtener transportistas eliminados (requiere autenticación y rol admin)
router.get('/deleted', auth, checkRole(['admin']), transportistaController.getDeletedTransportistas);

// GET /api/transportistas/:id - Obtener transportista por ID (requiere autenticación)
router.get('/:id', auth, transportistaController.getTransportistaById);

// POST /api/transportistas - Crear nuevo transportista (requiere autenticación y rol admin)
router.post('/', auth, checkRole(['admin']), validateTransportista, transportistaController.createTransportista);

// PUT /api/transportistas/:id - Actualizar transportista (requiere autenticación y rol admin)
router.put('/:id', auth, checkRole(['admin']), validateTransportista, transportistaController.updateTransportista);

// DELETE /api/transportistas/:id - Eliminar transportista (baja lógica, requiere autenticación y rol admin)
router.delete('/:id', auth, checkRole(['admin']), transportistaController.deleteTransportista);

// PATCH /api/transportistas/:id/restore - Restaurar transportista eliminado (requiere autenticación y rol admin)
router.patch('/:id/restore', auth, checkRole(['admin']), transportistaController.restoreTransportista);

// DELETE /api/transportistas/:id/force - Eliminar transportista permanentemente (requiere autenticación y rol admin)
router.delete('/:id/force', auth, checkRole(['admin']), transportistaController.forceDeleteTransportista);

module.exports = router; 