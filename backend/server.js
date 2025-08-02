const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

// Importar configuración de base de datos
const { testConnection, syncDatabase } = require('./config/database');

// Importar modelos
require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');
const residuoRoutes = require('./routes/residuos');
const destinoRoutes = require('./routes/destinos');
const vehiculoRoutes = require('./routes/vehiculos');
const transportistaRoutes = require('./routes/transportistas');
const clienteRoutes = require('./routes/clientes');
const manifiestoRoutes = require('./routes/manifiestos');
const manifiestoEstadoRoutes = require('./routes/manifiestoEstados');
const swaggerRoutes = require('./routes/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/residuos', residuoRoutes);
app.use('/api/destinos', destinoRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/transportistas', transportistaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/manifiestos', manifiestoRoutes);
app.use('/api/manifiesto-estados', manifiestoEstadoRoutes);
app.use('/api-docs', swaggerRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Ecomed funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      roles: '/api/roles',
      residuos: '/api/residuos',
      destinos: '/api/destinos',
      vehiculos: '/api/vehiculos',
      transportistas: '/api/transportistas',
      clientes: '/api/clientes',
      manifiestos: '/api/manifiestos',
      manifiestoEstados: '/api/manifiesto-estados',
      documentation: '/api-docs'
    }
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Función para inicializar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Sincronizar modelos con la base de datos
    await syncDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer(); 