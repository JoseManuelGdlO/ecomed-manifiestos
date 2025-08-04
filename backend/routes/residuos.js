const express = require('express');
const router = express.Router();
const residuoController = require('../controllers/residuoController');
const { validateResiduo } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/residuos:
 *   get:
 *     summary: Obtener todos los residuos activos
 *     tags: [Residuos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de residuos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Residuo'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, residuoController.getAllResiduos);

/**
 * @swagger
 * /api/residuos/deleted:
 *   get:
 *     summary: Obtener residuos eliminados
 *     tags: [Residuos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de residuos eliminados
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
 *                     $ref: '#/components/schemas/Residuo'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/deleted', auth, checkRole(['admin']), residuoController.getDeletedResiduos);

/**
 * @swagger
 * /api/residuos/{id}:
 *   get:
 *     summary: Obtener residuo por ID
 *     tags: [Residuos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del residuo
 *     responses:
 *       200:
 *         description: Residuo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Residuo'
 *       404:
 *         description: Residuo no encontrado
 */
router.get('/:id', auth, residuoController.getResiduoById);

/**
 * @swagger
 * /api/residuos:
 *   post:
 *     summary: Crear nuevo residuo
 *     tags: [Residuos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Aceite usado"
 *               descripcion:
 *                 type: string
 *                 example: "Aceite lubricante usado de motores"
 *     responses:
 *       201:
 *         description: Residuo creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', auth, checkRole(['admin']), validateResiduo, residuoController.createResiduo);

/**
 * @swagger
 * /api/residuos/{id}:
 *   put:
 *     summary: Actualizar residuo
 *     tags: [Residuos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del residuo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Residuo actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Residuo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.put('/:id', auth, checkRole(['admin']), validateResiduo, residuoController.updateResiduo);

/**
 * @swagger
 * /api/residuos/{id}:
 *   delete:
 *     summary: Eliminar residuo (baja lógica)
 *     tags: [Residuos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del residuo
 *     responses:
 *       200:
 *         description: Residuo eliminado exitosamente
 *       404:
 *         description: Residuo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id', auth, checkRole(['admin']), residuoController.deleteResiduo);

/**
 * @swagger
 * /api/residuos/{id}/restore:
 *   patch:
 *     summary: Restaurar residuo eliminado
 *     tags: [Residuos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del residuo
 *     responses:
 *       200:
 *         description: Residuo restaurado exitosamente
 *       404:
 *         description: Residuo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), residuoController.restoreResiduo);

/**
 * @swagger
 * /api/residuos/{id}/force:
 *   delete:
 *     summary: Eliminar residuo permanentemente
 *     tags: [Residuos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del residuo
 *     responses:
 *       200:
 *         description: Residuo eliminado permanentemente
 *       404:
 *         description: Residuo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id/force', auth, checkRole(['admin']), residuoController.forceDeleteResiduo);

module.exports = router; 