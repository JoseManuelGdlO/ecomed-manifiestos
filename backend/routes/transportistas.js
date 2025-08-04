const express = require('express');
const router = express.Router();
const transportistaController = require('../controllers/transportistaController');
const { validateTransportista } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/transportistas:
 *   get:
 *     summary: Obtener todos los transportistas activos
 *     tags: [Transportistas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transportistas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Transportista'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, transportistaController.getAllTransportistas);

/**
 * @swagger
 * /api/transportistas/deleted:
 *   get:
 *     summary: Obtener transportistas eliminados
 *     tags: [Transportistas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transportistas eliminados
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
 *                     $ref: '#/components/schemas/Transportista'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/deleted', auth, checkRole(['admin']), transportistaController.getDeletedTransportistas);

/**
 * @swagger
 * /api/transportistas/{id}:
 *   get:
 *     summary: Obtener transportista por ID
 *     tags: [Transportistas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del transportista
 *     responses:
 *       200:
 *         description: Transportista encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transportista'
 *       404:
 *         description: Transportista no encontrado
 */
router.get('/:id', auth, transportistaController.getTransportistaById);

/**
 * @swagger
 * /api/transportistas:
 *   post:
 *     summary: Crear nuevo transportista
 *     tags: [Transportistas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razon_social
 *             properties:
 *               razon_social:
 *                 type: string
 *                 example: "Transportes Ecológicos S.A. de C.V."
 *               codigo_postal:
 *                 type: string
 *                 example: "12345"
 *               calle:
 *                 type: string
 *                 example: "Av. Transporte"
 *               num_ext:
 *                 type: string
 *                 example: "456"
 *               num_int:
 *                 type: string
 *                 example: "B"
 *               colonia:
 *                 type: string
 *                 example: "Zona Industrial"
 *               delegacion:
 *                 type: string
 *                 example: "Iztapalapa"
 *               estado:
 *                 type: string
 *                 example: "Ciudad de México"
 *               telefono:
 *                 type: string
 *                 example: "555-987-6543"
 *               correo_electronico:
 *                 type: string
 *                 format: email
 *                 example: "contacto@transportes.com"
 *               autorizacion_semarnat:
 *                 type: string
 *                 example: "SEMARNAT-TRANS-001"
 *               permiso_sct:
 *                 type: string
 *                 example: "SCT-TRANS-2024"
 *               tipo_vehiculo:
 *                 type: string
 *                 example: "Camión de carga"
 *               placa:
 *                 type: string
 *                 example: "XYZ-789"
 *               ruta_empresa:
 *                 type: string
 *                 example: "Ruta centro-norte"
 *     responses:
 *       201:
 *         description: Transportista creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', auth, checkRole(['admin']), validateTransportista, transportistaController.createTransportista);

/**
 * @swagger
 * /api/transportistas/{id}:
 *   put:
 *     summary: Actualizar transportista
 *     tags: [Transportistas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del transportista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *               permiso_sct:
 *                 type: string
 *               tipo_vehiculo:
 *                 type: string
 *               placa:
 *                 type: string
 *               ruta_empresa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transportista actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Transportista no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.put('/:id', auth, checkRole(['admin']), validateTransportista, transportistaController.updateTransportista);

/**
 * @swagger
 * /api/transportistas/{id}:
 *   delete:
 *     summary: Eliminar transportista (baja lógica)
 *     tags: [Transportistas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del transportista
 *     responses:
 *       200:
 *         description: Transportista eliminado exitosamente
 *       404:
 *         description: Transportista no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id', auth, checkRole(['admin']), transportistaController.deleteTransportista);

/**
 * @swagger
 * /api/transportistas/{id}/restore:
 *   patch:
 *     summary: Restaurar transportista eliminado
 *     tags: [Transportistas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del transportista
 *     responses:
 *       200:
 *         description: Transportista restaurado exitosamente
 *       404:
 *         description: Transportista no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), transportistaController.restoreTransportista);

/**
 * @swagger
 * /api/transportistas/{id}/force:
 *   delete:
 *     summary: Eliminar transportista permanentemente
 *     tags: [Transportistas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del transportista
 *     responses:
 *       200:
 *         description: Transportista eliminado permanentemente
 *       404:
 *         description: Transportista no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id/force', auth, checkRole(['admin']), transportistaController.forceDeleteTransportista);

module.exports = router; 