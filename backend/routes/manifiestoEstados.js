const express = require('express');
const router = express.Router();
const manifiestoEstadoController = require('../controllers/manifiestoEstadoController');
const { validateManifiestoEstado } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

// Rutas para estados de manifiestos
router.get('/', auth, manifiestoEstadoController.getAllManifiestoEstados);
router.get('/deleted', auth, checkRole(['admin']), manifiestoEstadoController.getDeletedManifiestoEstados);
router.get('/:id', auth, manifiestoEstadoController.getManifiestoEstadoById);
router.post('/', auth, checkRole(['admin']), validateManifiestoEstado, manifiestoEstadoController.createManifiestoEstado);
router.put('/:id', auth, checkRole(['admin']), validateManifiestoEstado, manifiestoEstadoController.updateManifiestoEstado);
router.delete('/:id', auth, checkRole(['admin']), manifiestoEstadoController.deleteManifiestoEstado);
router.patch('/:id/restore', auth, checkRole(['admin']), manifiestoEstadoController.restoreManifiestoEstado);
router.delete('/:id/force', auth, checkRole(['admin']), manifiestoEstadoController.forceDeleteManifiestoEstado);

module.exports = router; 