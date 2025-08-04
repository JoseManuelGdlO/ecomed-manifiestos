const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const { validateVehiculo } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtener todos los vehículos activos
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehiculo'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, vehiculoController.getAllVehiculos);

/**
 * @swagger
 * /api/vehiculos/deleted:
 *   get:
 *     summary: Obtener vehículos eliminados
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos eliminados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehiculo'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/deleted', auth, checkRole(['admin']), vehiculoController.getDeletedVehiculos);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener vehículo por ID
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 */
router.get('/:id', auth, vehiculoController.getVehiculoById);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear nuevo vehículo
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - marca
 *               - nombre
 *               - placa
 *             properties:
 *               marca:
 *                 type: string
 *                 example: "Ford"
 *               nombre:
 *                 type: string
 *                 example: "F-150"
 *               descripcion:
 *                 type: string
 *                 example: "Camioneta pickup para transporte de residuos"
 *               placa:
 *                 type: string
 *                 example: "ABC-123"
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', auth, checkRole(['admin']), validateVehiculo, vehiculoController.createVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehículo
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               placa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.put('/:id', auth, checkRole(['admin']), validateVehiculo, vehiculoController.updateVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar vehículo (baja lógica)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id', auth, checkRole(['admin']), vehiculoController.deleteVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}/restore:
 *   patch:
 *     summary: Restaurar vehículo eliminado
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo restaurado exitosamente
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), vehiculoController.restoreVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}/force:
 *   delete:
 *     summary: Eliminar vehículo permanentemente
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo eliminado permanentemente
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id/force', auth, checkRole(['admin']), vehiculoController.forceDeleteVehiculo);

module.exports = router; 