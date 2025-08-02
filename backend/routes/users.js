const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
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
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, checkRole(['admin']), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', auth, checkRole(['admin']), userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_completo
 *               - correo
 *               - contrasena
 *               - id_rol
 *             properties:
 *               nombre_completo:
 *                 type: string
 *                 example: "Juan Pérez"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "juan@ecomed.com"
 *               contrasena:
 *                 type: string
 *                 example: "password123"
 *               id_rol:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', auth, checkRole(['admin']), validateUser, userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_completo:
 *                 type: string
 *               correo:
 *                 type: string
 *                 format: email
 *               contrasena:
 *                 type: string
 *               id_rol:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', auth, checkRole(['admin']), validateUser, userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario (baja lógica)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', auth, checkRole(['admin']), userController.deleteUser);

/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Restaurar usuario eliminado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario restaurado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), userController.restoreUser);

/**
 * @swagger
 * /api/users/deleted:
 *   get:
 *     summary: Obtener usuarios eliminados
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios eliminados
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
 *                     $ref: '#/components/schemas/User'
 */
router.get('/deleted', auth, checkRole(['admin']), userController.getDeletedUsers);

module.exports = router; 