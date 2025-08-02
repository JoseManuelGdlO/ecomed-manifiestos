const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { validateRole } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Role'
 */
router.get('/', auth, roleController.getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 */
router.get('/:id', auth, roleController.getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear nuevo rol
 *     tags: [Roles]
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
 *                 example: "Operador"
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', auth, checkRole(['admin']), validateRole, roleController.createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       404:
 *         description: Rol no encontrado
 */
router.put('/:id', auth, checkRole(['admin']), validateRole, roleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar rol (baja lógica)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 */
router.delete('/:id', auth, checkRole(['admin']), roleController.deleteRole);

/**
 * @swagger
 * /api/roles/{id}/restore:
 *   patch:
 *     summary: Restaurar rol eliminado
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol restaurado exitosamente
 *       404:
 *         description: Rol no encontrado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), roleController.restoreRole);

/**
 * @swagger
 * /api/roles/deleted:
 *   get:
 *     summary: Obtener roles eliminados
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles eliminados
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
 *                     $ref: '#/components/schemas/Role'
 */
router.get('/deleted', auth, checkRole(['admin']), roleController.getDeletedRoles);

module.exports = router; 