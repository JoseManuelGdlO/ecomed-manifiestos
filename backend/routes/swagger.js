const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const specs = require('../swagger');

// Configuración de Swagger UI
const swaggerOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Ecomed - Documentación',
  customfavIcon: '/favicon.ico'
};

// Ruta para la documentación Swagger
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, swaggerOptions));

module.exports = router; 