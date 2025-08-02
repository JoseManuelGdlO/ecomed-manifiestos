const express = require('express');
const router = express.Router();
const manifiestoController = require('../controllers/manifiestoController');
const { validateManifiesto } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

// Rutas para manifiestos
router.get('/', auth, manifiestoController.getAllManifiestos);
router.get('/deleted', auth, checkRole(['admin']), manifiestoController.getDeletedManifiestos);
router.get('/:id', auth, manifiestoController.getManifiestoById);
router.post('/', auth, checkRole(['admin']), validateManifiesto, manifiestoController.createManifiesto);
router.put('/:id', auth, checkRole(['admin']), validateManifiesto, manifiestoController.updateManifiesto);
router.delete('/:id', auth, checkRole(['admin']), manifiestoController.deleteManifiesto);
router.patch('/:id/restore', auth, checkRole(['admin']), manifiestoController.restoreManifiesto);
router.delete('/:id/force', auth, checkRole(['admin']), manifiestoController.forceDeleteManifiesto);

module.exports = router; 