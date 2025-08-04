const express = require('express');
const router = express.Router();
const destinoController = require('../controllers/destinoController');
const { validateDestino } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/destinos:
 *   get:
 *     summary: Obtener todos los destinos activos
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de destinos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Destino'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, destinoController.getAllDestinos);

/**
 * @swagger
 * /api/destinos/deleted:
 *   get:
 *     summary: Obtener destinos eliminados
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de destinos eliminados
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
 *                     $ref: '#/components/schemas/Destino'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/deleted', auth, checkRole(['admin']), destinoController.getDeletedDestinos);

/**
 * @swagger
 * /api/destinos/{id}:
 *   get:
 *     summary: Obtener destino por ID
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Destino encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Destino'
 *       404:
 *         description: Destino no encontrado
 */
router.get('/:id', auth, destinoController.getDestinoById);

/**
 * @swagger
 * /api/destinos:
 *   post:
 *     summary: Crear nuevo destino
 *     tags: [Destinos]
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
 *               - razon_social
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Centro de Disposición Final"
 *               descripcion:
 *                 type: string
 *                 example: "Centro autorizado para disposición final de residuos"
 *               razon_social:
 *                 type: string
 *                 example: "Empresa de Disposición S.A. de C.V."
 *               codigo_postal:
 *                 type: string
 *                 example: "12345"
 *               calle:
 *                 type: string
 *                 example: "Av. Principal"
 *               num_ext:
 *                 type: string
 *                 example: "123"
 *               num_int:
 *                 type: string
 *                 example: "A"
 *               colonia:
 *                 type: string
 *                 example: "Centro Industrial"
 *               delegacion:
 *                 type: string
 *                 example: "Cuauhtémoc"
 *               estado:
 *                 type: string
 *                 example: "Ciudad de México"
 *               telefono:
 *                 type: string
 *                 example: "555-123-4567"
 *               correo_electronico:
 *                 type: string
 *                 format: email
 *                 example: "contacto@destino.com"
 *               autorizacion_semarnat:
 *                 type: string
 *                 example: "SEMARNAT-001-2024"
 *               nombre_encargado:
 *                 type: string
 *                 example: "Juan Pérez"
 *               cargo_encargado:
 *                 type: string
 *                 example: "Director General"
 *               observaciones:
 *                 type: string
 *                 example: "Centro autorizado para residuos peligrosos"
 *     responses:
 *       201:
 *         description: Destino creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', auth, checkRole(['admin']), validateDestino, destinoController.createDestino);

/**
 * @swagger
 * /api/destinos/{id}:
 *   put:
 *     summary: Actualizar destino
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino
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
 *               razon_social:
 *                 type: string
 *               codigo_postal:
 *                 type: string
 *               calle:
 *                 type: string
 *               num_ext:
 *                 type: string
 *               num_int:
 *                 type: string
 *               colonia:
 *                 type: string
 *               delegacion:
 *                 type: string
 *               estado:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo_electronico:
 *                 type: string
 *                 format: email
 *               autorizacion_semarnat:
 *                 type: string
 *               nombre_encargado:
 *                 type: string
 *               cargo_encargado:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Destino actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Destino no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.put('/:id', auth, checkRole(['admin']), validateDestino, destinoController.updateDestino);

/**
 * @swagger
 * /api/destinos/{id}:
 *   delete:
 *     summary: Eliminar destino (baja lógica)
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Destino eliminado exitosamente
 *       404:
 *         description: Destino no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id', auth, checkRole(['admin']), destinoController.deleteDestino);

/**
 * @swagger
 * /api/destinos/{id}/restore:
 *   patch:
 *     summary: Restaurar destino eliminado
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Destino restaurado exitosamente
 *       404:
 *         description: Destino no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), destinoController.restoreDestino);

/**
 * @swagger
 * /api/destinos/{id}/force:
 *   delete:
 *     summary: Eliminar destino permanentemente
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Destino eliminado permanentemente
 *       404:
 *         description: Destino no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id/force', auth, checkRole(['admin']), destinoController.forceDeleteDestino);

module.exports = router; 