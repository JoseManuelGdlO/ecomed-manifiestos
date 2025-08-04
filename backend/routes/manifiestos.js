const express = require('express');
const router = express.Router();
const manifiestoController = require('../controllers/manifiestoController');
const { validateManifiesto } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/manifiestos:
 *   get:
 *     summary: Obtener todos los manifiestos activos con paginación y filtros
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda general en número de libro
 *       - in: query
 *         name: numero_libro
 *         schema:
 *           type: string
 *         description: Filtrar por número de libro específico
 *       - in: query
 *         name: id_cliente
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de cliente
 *       - in: query
 *         name: id_destino
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de destino del cliente
 *       - in: query
 *         name: id_transportista
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de transportista del cliente
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha de creación desde
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha de creación hasta
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, numero_libro, created_at, updated_at]
 *           default: created_at
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Orden de clasificación
 *     responses:
 *       200:
 *         description: Lista de manifiestos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Manifiesto'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                     prevPage:
 *                       type: integer
 *                       nullable: true
 *                 filters:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: string
 *                       nullable: true
 *                     numero_libro:
 *                       type: string
 *                       nullable: true
 *                     id_cliente:
 *                       type: integer
 *                       nullable: true
 *                     id_destino:
 *                       type: integer
 *                       nullable: true
 *                     id_transportista:
 *                       type: integer
 *                       nullable: true
 *                     fecha_inicio:
 *                       type: string
 *                       nullable: true
 *                     fecha_fin:
 *                       type: string
 *                       nullable: true
 *                     sortBy:
 *                       type: string
 *                     sortOrder:
 *                       type: string
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, manifiestoController.getAllManifiestos);

/**
 * @swagger
 * /api/manifiestos/filters:
 *   get:
 *     summary: Obtener opciones de filtros disponibles para manifiestos
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Opciones de filtros obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre_razon_social:
 *                             type: string
 *                           numero_registro_ambiental:
 *                             type: string
 *                     destinos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           razon_social:
 *                             type: string
 *                     transportistas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           razon_social:
 *                             type: string
 *                           placa:
 *                             type: string
 *                     residuos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           descripcion:
 *                             type: string
 *       401:
 *         description: No autorizado
 */
router.get('/filters', auth, manifiestoController.getManifiestoFilters);

/**
 * @swagger
 * /api/manifiestos/deleted:
 *   get:
 *     summary: Obtener manifiestos eliminados
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de manifiestos eliminados
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
 *                     $ref: '#/components/schemas/Manifiesto'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/deleted', auth, checkRole(['admin']), manifiestoController.getDeletedManifiestos);

/**
 * @swagger
 * /api/manifiestos/{id}:
 *   get:
 *     summary: Obtener manifiesto por ID
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del manifiesto
 *     responses:
 *       200:
 *         description: Manifiesto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Manifiesto'
 *       404:
 *         description: Manifiesto no encontrado
 */
router.get('/:id', auth, manifiestoController.getManifiestoById);

/**
 * @swagger
 * /api/manifiestos:
 *   post:
 *     summary: Crear nuevo manifiesto
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_libro
 *               - id_cliente
 *             properties:
 *               numero_libro:
 *                 type: string
 *                 example: "LIB-2024-001"
 *               id_cliente:
 *                 type: integer
 *                 example: 1
 *               residuos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_residuo:
 *                       type: integer
 *                     cantidad:
 *                       type: number
 *                     unidad_medida:
 *                       type: string
 *     responses:
 *       201:
 *         description: Manifiesto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', auth, checkRole(['admin']), validateManifiesto, manifiestoController.createManifiesto);

/**
 * @swagger
 * /api/manifiestos/{id}:
 *   put:
 *     summary: Actualizar manifiesto
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del manifiesto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_libro:
 *                 type: string
 *               id_cliente:
 *                 type: integer
 *               residuos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_residuo:
 *                       type: integer
 *                     cantidad:
 *                       type: number
 *                     unidad_medida:
 *                       type: string
 *     responses:
 *       200:
 *         description: Manifiesto actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Manifiesto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.put('/:id', auth, checkRole(['admin']), validateManifiesto, manifiestoController.updateManifiesto);

/**
 * @swagger
 * /api/manifiestos/{id}:
 *   delete:
 *     summary: Eliminar manifiesto (baja lógica)
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del manifiesto
 *     responses:
 *       200:
 *         description: Manifiesto eliminado exitosamente
 *       404:
 *         description: Manifiesto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id', auth, checkRole(['admin']), manifiestoController.deleteManifiesto);

/**
 * @swagger
 * /api/manifiestos/{id}/restore:
 *   patch:
 *     summary: Restaurar manifiesto eliminado
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del manifiesto
 *     responses:
 *       200:
 *         description: Manifiesto restaurado exitosamente
 *       404:
 *         description: Manifiesto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), manifiestoController.restoreManifiesto);

/**
 * @swagger
 * /api/manifiestos/{id}/force:
 *   delete:
 *     summary: Eliminar manifiesto permanentemente
 *     tags: [Manifiestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del manifiesto
 *     responses:
 *       200:
 *         description: Manifiesto eliminado permanentemente
 *       404:
 *         description: Manifiesto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id/force', auth, checkRole(['admin']), manifiestoController.forceDeleteManifiesto);

module.exports = router; 