const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { validateCliente } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV y Excel (.xlsx, .xls)'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  }
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 10MB permitido.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Error al subir el archivo: ' + error.message
    });
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
};

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes activos con paginación y filtros
 *     tags: [Clientes]
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
 *         description: Búsqueda general en número de registro, razón social, correo y teléfono
 *       - in: query
 *         name: zona
 *         schema:
 *           type: string
 *         description: Filtrar por zona
 *       - in: query
 *         name: delegacion
 *         schema:
 *           type: string
 *         description: Filtrar por delegación
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *       - in: query
 *         name: id_destino
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de destino
 *       - in: query
 *         name: id_transportista
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de transportista
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, numero_registro_ambiental, nombre_razon_social, zona, delegacion, estado, created_at, updated_at]
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
 *         description: Lista de clientes obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Cliente'
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
 *                     zona:
 *                       type: string
 *                       nullable: true
 *                     delegacion:
 *                       type: string
 *                       nullable: true
 *                     estado:
 *                       type: string
 *                       nullable: true
 *                     id_destino:
 *                       type: integer
 *                       nullable: true
 *                     id_transportista:
 *                       type: integer
 *                       nullable: true
 *                     sortBy:
 *                       type: string
 *                     sortOrder:
 *                       type: string
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, clienteController.getAllClientes);

/**
 * @swagger
 * /api/clientes/filters:
 *   get:
 *     summary: Obtener opciones de filtros disponibles para clientes
 *     tags: [Clientes]
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
 *                     zonas:
 *                       type: array
 *                       items:
 *                         type: string
 *                     delegaciones:
 *                       type: array
 *                       items:
 *                         type: string
 *                     estados:
 *                       type: array
 *                       items:
 *                         type: string
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
 *       401:
 *         description: No autorizado
 */
router.get('/filters', auth, clienteController.getClienteFilters);

/**
 * @swagger
 * /api/clientes/deleted:
 *   get:
 *     summary: Obtener clientes eliminados
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes eliminados
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
 *                     $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/deleted', auth, checkRole(['admin']), clienteController.getDeletedClientes);

/**
 * @swagger
 * /api/clientes/bulk-upload:
 *   post:
 *     summary: Carga masiva de clientes desde archivo CSV o Excel
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CSV o Excel con datos de clientes
 *     responses:
 *       200:
 *         description: Carga masiva completada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     exitosos:
 *                       type: integer
 *                     fallidos:
 *                       type: integer
 *                     detalles_exitosos:
 *                       type: array
 *                       items:
 *                         type: object
 *                     detalles_fallidos:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Error en el archivo o formato no válido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/bulk-upload', auth, checkRole(['admin']), upload.single('file'), handleMulterError, clienteController.bulkUploadClientes);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', auth, clienteController.getClienteById);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear nuevo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_registro_ambiental
 *               - nombre_razon_social
 *             properties:
 *               numero_registro_ambiental:
 *                 type: string
 *                 example: "RAMA-001-2024"
 *               nombre_razon_social:
 *                 type: string
 *                 example: "Empresa Industrial S.A. de C.V."
 *               codigo_postal:
 *                 type: string
 *                 example: "54321"
 *               calle:
 *                 type: string
 *                 example: "Calle Industrial"
 *               num_ext:
 *                 type: string
 *                 example: "789"
 *               num_int:
 *                 type: string
 *                 example: "C"
 *               colonia:
 *                 type: string
 *                 example: "Parque Industrial"
 *               delegacion:
 *                 type: string
 *                 example: "Tlalpan"
 *               estado:
 *                 type: string
 *                 example: "Ciudad de México"
 *               telefono:
 *                 type: string
 *                 example: "555-456-7890"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "contacto@empresa.com"
 *               zona:
 *                 type: string
 *                 example: "Zona Sur"
 *               id_destino:
 *                 type: integer
 *                 example: 1
 *               id_transportista:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', auth, checkRole(['admin']), validateCliente, clienteController.createCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_registro_ambiental:
 *                 type: string
 *               nombre_razon_social:
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
 *               correo:
 *                 type: string
 *                 format: email
 *               zona:
 *                 type: string
 *               id_destino:
 *                 type: integer
 *               id_transportista:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.put('/:id', auth, checkRole(['admin']), validateCliente, clienteController.updateCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar cliente (baja lógica)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id', auth, checkRole(['admin']), clienteController.deleteCliente);

/**
 * @swagger
 * /api/clientes/{id}/restore:
 *   patch:
 *     summary: Restaurar cliente eliminado
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente restaurado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.patch('/:id/restore', auth, checkRole(['admin']), clienteController.restoreCliente);

/**
 * @swagger
 * /api/clientes/{id}/force:
 *   delete:
 *     summary: Eliminar cliente permanentemente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado permanentemente
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.delete('/:id/force', auth, checkRole(['admin']), clienteController.forceDeleteCliente);

module.exports = router; 