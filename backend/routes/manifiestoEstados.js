const express = require('express');
const router = express.Router();
const manifiestoEstadoController = require('../controllers/manifiestoEstadoController');
const { validateManifiestoEstado } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/manifiesto-estados:
 *   get:
 *     summary: Obtener todos los estados de manifiestos activos
 *     tags: [Estados de Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados de manifiestos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/ManifiestoEstado'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, manifiestoEstadoController.getAllManifiestoEstados);

/**
 * @swagger
 * /api/manifiesto-estados/deleted:
 *   get:
 *     summary: Obtener estados de manifiestos eliminados
 *     tags: [Estados de Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados de manifiestos eliminados
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
 *                     $ref: '#/components/schemas/ManifiestoEstado'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/deleted', auth, checkRole(['admin']), manifiestoEstadoController.getDeletedManifiestoEstados);

/**
 * @swagger
 * /api/manifiesto-estados/{id}:
 *   get:
 *     summary: Obtener estado de manifiesto por ID
 *     tags: [Estados de Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado de manifiesto
 *     responses:
 *       200:
 *         description: Estado de manifiesto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ManifiestoEstado'
 *       404:
 *         description: Estado de manifiesto no encontrado
 */
router.get('/:id', auth, manifiestoEstadoController.getManifiestoEstadoById);

/**
 * @swagger
 * /api/manifiesto-estados:
 *   post:
 *     summary: Crear nuevo estado de manifiesto
 *     tags: [Estados de Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_manifiesto
 *             properties:
 *               id_manifiesto:
 *                 type: integer
 *                 example: 1
 *               esta_capturado:
 *                 type: boolean
 *                 example: false
 *               esta_entregado:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Estado de manifiesto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', auth, checkRole(['admin']), validateManifiestoEstado, manifiestoEstadoController.createManifiestoEstado);

/**
 * @swagger
 * /api/manifiesto-estados/{id}:
 *   put:
 *     summary: Actualizar estado de manifiesto
 *     tags: [Estados de Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado de manifiesto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_manifiesto:
 *                 type: integer
 *               esta_capturado:
 *                 type: boolean
 *               esta_entregado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado de manifiesto actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Estado de manifiesto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.put('/:id', auth, checkRole(['admin']), validateManifiestoEstado, manifiestoEstadoController.updateManifiestoEstado);

/**
 * @swagger
 * /api/manifiesto-estados/{id}:
 *   delete:
 *     summary: Eliminar estado de manifiesto (baja lógica)
 *     tags: [Estados de Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado de manifiesto
 *     responses:
 *       200:
 *         description: Estado de manifiesto eliminado exitosamente
 *       404:
 *         description: Estado de manifiesto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id', auth, checkRole(['admin']), manifiestoEstadoController.deleteManifiestoEstado);

/**
 * @swagger
 * /api/manifiesto-estados/{id}/restore:
 *   patch:
 *     summary: Restaurar estado de manifiesto eliminado
 *     tags: [Estados de Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado de manifiesto
 *     responses:
 *       200:
 *         description: Estado de manifiesto restaurado exitosamente
 *       404:
 *         description: Estado de manifiesto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), manifiestoEstadoController.restoreManifiestoEstado);

/**
 * @swagger
 * /api/manifiesto-estados/{id}/force:
 *   delete:
 *     summary: Eliminar estado de manifiesto permanentemente
 *     tags: [Estados de Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado de manifiesto
 *     responses:
 *       200:
 *         description: Estado de manifiesto eliminado permanentemente
 *       404:
 *         description: Estado de manifiesto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id/force', auth, checkRole(['admin']), manifiestoEstadoController.forceDeleteManifiestoEstado);

module.exports = router; 