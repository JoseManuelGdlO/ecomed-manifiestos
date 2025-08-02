const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { validateCliente } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

// GET /api/clientes - Obtener todos los clientes activos (requiere autenticación)
router.get('/', auth, clienteController.getAllClientes);

// GET /api/clientes/deleted - Obtener clientes eliminados (requiere autenticación y rol admin)
router.get('/deleted', auth, checkRole(['admin']), clienteController.getDeletedClientes);

// GET /api/clientes/:id - Obtener cliente por ID (requiere autenticación)
router.get('/:id', auth, clienteController.getClienteById);

// POST /api/clientes - Crear nuevo cliente (requiere autenticación y rol admin)
router.post('/', auth, checkRole(['admin']), validateCliente, clienteController.createCliente);

// PUT /api/clientes/:id - Actualizar cliente (requiere autenticación y rol admin)
router.put('/:id', auth, checkRole(['admin']), validateCliente, clienteController.updateCliente);

// DELETE /api/clientes/:id - Eliminar cliente (baja lógica, requiere autenticación y rol admin)
router.delete('/:id', auth, checkRole(['admin']), clienteController.deleteCliente);

// PATCH /api/clientes/:id/restore - Restaurar cliente eliminado (requiere autenticación y rol admin)
router.patch('/:id/restore', auth, checkRole(['admin']), clienteController.restoreCliente);

// DELETE /api/clientes/:id/force - Eliminar cliente permanentemente (requiere autenticación y rol admin)
router.delete('/:id/force', auth, checkRole(['admin']), clienteController.forceDeleteCliente);

module.exports = router; 