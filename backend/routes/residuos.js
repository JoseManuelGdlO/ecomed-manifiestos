const express = require('express');
const router = express.Router();
const residuoController = require('../controllers/residuoController');
const { validateResiduo } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

// GET /api/residuos - Obtener todos los residuos activos (requiere autenticación)
router.get('/', auth, residuoController.getAllResiduos);

// GET /api/residuos/deleted - Obtener residuos eliminados (requiere autenticación y rol admin)
router.get('/deleted', auth, checkRole(['admin']), residuoController.getDeletedResiduos);

// GET /api/residuos/:id - Obtener residuo por ID (requiere autenticación)
router.get('/:id', auth, residuoController.getResiduoById);

// POST /api/residuos - Crear nuevo residuo (requiere autenticación y rol admin)
router.post('/', auth, checkRole(['admin']), validateResiduo, residuoController.createResiduo);

// PUT /api/residuos/:id - Actualizar residuo (requiere autenticación y rol admin)
router.put('/:id', auth, checkRole(['admin']), validateResiduo, residuoController.updateResiduo);

// DELETE /api/residuos/:id - Eliminar residuo (baja lógica, requiere autenticación y rol admin)
router.delete('/:id', auth, checkRole(['admin']), residuoController.deleteResiduo);

// PATCH /api/residuos/:id/restore - Restaurar residuo eliminado (requiere autenticación y rol admin)
router.patch('/:id/restore', auth, checkRole(['admin']), residuoController.restoreResiduo);

// DELETE /api/residuos/:id/force - Eliminar residuo permanentemente (requiere autenticación y rol admin)
router.delete('/:id/force', auth, checkRole(['admin']), residuoController.forceDeleteResiduo);

module.exports = router; 