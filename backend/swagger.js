const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Ecomed - Sistema de Gestión de Residuos',
      version: '1.0.0',
      description: 'API completa para el sistema de gestión de residuos Ecomed. Incluye autenticación JWT, gestión de usuarios, catálogos, clientes, transportistas y sistema de manifiestos.',
      contact: {
        name: 'Ecomed API Support',
        email: 'support@ecomed.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Schemas para autenticación
        LoginRequest: {
          type: 'object',
          required: ['correo', 'contrasena'],
          properties: {
            correo: {
              type: 'string',
              format: 'email',
              example: 'admin@ecomed.com'
            },
            contrasena: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                nombre_completo: { type: 'string' },
                correo: { type: 'string' },
                id_rol: { type: 'integer' }
              }
            }
          }
        },
        
        // Schemas para Roles
        Role: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para Usuarios
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre_completo: { type: 'string' },
            correo: { type: 'string' },
            id_rol: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para Residuos
        Residuo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para Destinos
        Destino: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            razon_social: { type: 'string' },
            codigo_postal: { type: 'string' },
            calle: { type: 'string' },
            num_ext: { type: 'string' },
            num_int: { type: 'string' },
            colonia: { type: 'string' },
            delegacion: { type: 'string' },
            estado: { type: 'string' },
            telefono: { type: 'string' },
            correo_electronico: { type: 'string' },
            autorizacion_semarnat: { type: 'string' },
            nombre_encargado: { type: 'string' },
            cargo_encargado: { type: 'string' },
            observaciones: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para Vehículos
        Vehiculo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            marca: { type: 'string' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            placa: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para Transportistas
        Transportista: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            razon_social: { type: 'string' },
            codigo_postal: { type: 'string' },
            calle: { type: 'string' },
            num_ext: { type: 'string' },
            num_int: { type: 'string' },
            colonia: { type: 'string' },
            delegacion: { type: 'string' },
            estado: { type: 'string' },
            telefono: { type: 'string' },
            correo_electronico: { type: 'string' },
            autorizacion_semarnat: { type: 'string' },
            permiso_sct: { type: 'string' },
            tipo_vehiculo: { type: 'string' },
            placa: { type: 'string' },
            ruta_empresa: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para Clientes
        Cliente: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            numero_registro_ambiental: { type: 'string' },
            nombre_razon_social: { type: 'string' },
            codigo_postal: { type: 'string' },
            calle: { type: 'string' },
            num_ext: { type: 'string' },
            num_int: { type: 'string' },
            colonia: { type: 'string' },
            delegacion: { type: 'string' },
            estado: { type: 'string' },
            telefono: { type: 'string' },
            correo: { type: 'string' },
            zona: { type: 'string' },
            id_destino: { type: 'integer' },
            id_transportista: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para Manifiestos
        Manifiesto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            numero_libro: { type: 'string' },
            id_cliente: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para ManifiestoResiduo
        ManifiestoResiduo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            id_manifiesto: { type: 'integer' },
            id_residuo: { type: 'integer' },
            cantidad: { type: 'number', format: 'decimal' },
            unidad_medida: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schemas para ManifiestoEstado
        ManifiestoEstado: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            id_manifiesto: { type: 'integer' },
            esta_capturado: { type: 'boolean' },
            esta_entregado: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 