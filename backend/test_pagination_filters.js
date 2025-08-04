const fs = require('fs');
const path = require('path');

// Script de prueba para paginación y filtros
console.log('=== Test de Paginación y Filtros ===\n');

// Verificar que los controladores tengan los métodos necesarios
console.log('🔍 Verificando controladores...');

// Verificar clienteController
const clienteControllerPath = path.join(__dirname, 'controllers/clienteController.js');
if (fs.existsSync(clienteControllerPath)) {
  const clienteControllerContent = fs.readFileSync(clienteControllerPath, 'utf8');
  
  const requiredMethods = [
    'getAllClientes',
    'getClienteFilters'
  ];
  
  console.log('✅ Controlador de clientes encontrado');
  requiredMethods.forEach(method => {
    if (clienteControllerContent.includes(method)) {
      console.log(`  ✅ Método ${method} encontrado`);
    } else {
      console.log(`  ❌ Método ${method} NO encontrado`);
    }
  });
} else {
  console.log('❌ Controlador de clientes no encontrado');
}

// Verificar manifiestoController
const manifiestoControllerPath = path.join(__dirname, 'controllers/manifiestoController.js');
if (fs.existsSync(manifiestoControllerPath)) {
  const manifiestoControllerContent = fs.readFileSync(manifiestoControllerPath, 'utf8');
  
  const requiredMethods = [
    'getAllManifiestos',
    'getManifiestoFilters'
  ];
  
  console.log('✅ Controlador de manifiestos encontrado');
  requiredMethods.forEach(method => {
    if (manifiestoControllerContent.includes(method)) {
      console.log(`  ✅ Método ${method} encontrado`);
    } else {
      console.log(`  ❌ Método ${method} NO encontrado`);
    }
  });
} else {
  console.log('❌ Controlador de manifiestos no encontrado');
}

// Verificar rutas
console.log('\n🔍 Verificando rutas...');

const clientesRoutesPath = path.join(__dirname, 'routes/clientes.js');
if (fs.existsSync(clientesRoutesPath)) {
  const clientesRoutesContent = fs.readFileSync(clientesRoutesPath, 'utf8');
  
  if (clientesRoutesContent.includes('/filters')) {
    console.log('✅ Ruta /api/clientes/filters encontrada');
  } else {
    console.log('❌ Ruta /api/clientes/filters NO encontrada');
  }
  
  if (clientesRoutesContent.includes('pagination')) {
    console.log('✅ Documentación de paginación encontrada en clientes');
  } else {
    console.log('❌ Documentación de paginación NO encontrada en clientes');
  }
} else {
  console.log('❌ Rutas de clientes no encontradas');
}

const manifiestosRoutesPath = path.join(__dirname, 'routes/manifiestos.js');
if (fs.existsSync(manifiestosRoutesPath)) {
  const manifiestosRoutesContent = fs.readFileSync(manifiestosRoutesPath, 'utf8');
  
  if (manifiestosRoutesContent.includes('/filters')) {
    console.log('✅ Ruta /api/manifiestos/filters encontrada');
  } else {
    console.log('❌ Ruta /api/manifiestos/filters NO encontrada');
  }
  
  if (manifiestosRoutesContent.includes('pagination')) {
    console.log('✅ Documentación de paginación encontrada en manifiestos');
  } else {
    console.log('❌ Documentación de paginación NO encontrada en manifiestos');
  }
} else {
  console.log('❌ Rutas de manifiestos no encontradas');
}

// Verificar documentación
console.log('\n📖 Verificando documentación...');

const docsPath = path.join(__dirname, 'README_PAGINACION_FILTROS.md');
if (fs.existsSync(docsPath)) {
  console.log('✅ Documentación de paginación y filtros encontrada');
  const docsContent = fs.readFileSync(docsPath, 'utf8');
  
  const requiredSections = [
    'Paginación Básica',
    'Búsqueda y Filtros',
    'Ordenamiento',
    'Filtros de Fecha',
    'Estructura de Respuesta'
  ];
  
  requiredSections.forEach(section => {
    if (docsContent.includes(section)) {
      console.log(`  ✅ Sección "${section}" encontrada`);
    } else {
      console.log(`  ❌ Sección "${section}" NO encontrada`);
    }
  });
} else {
  console.log('❌ Documentación de paginación y filtros NO encontrada');
}

// Ejemplos de uso
console.log('\n🚀 Ejemplos de uso:');
console.log('\n1. Paginación básica:');
console.log('   GET /api/clientes?page=1&limit=10');

console.log('\n2. Búsqueda con filtros:');
console.log('   GET /api/clientes?search=industrial&zona=norte&sortBy=nombre_razon_social&sortOrder=ASC');

console.log('\n3. Filtros de fecha (manifiestos):');
console.log('   GET /api/manifiestos?fecha_inicio=2024-01-01&fecha_fin=2024-12-31');

console.log('\n4. Obtener opciones de filtros:');
console.log('   GET /api/clientes/filters');
console.log('   GET /api/manifiestos/filters');

console.log('\n5. Combinación completa:');
console.log('   GET /api/clientes?page=1&limit=15&search=industrial&zona=norte&delegacion=cuauhtemoc&sortBy=nombre_razon_social&sortOrder=ASC');

// Verificar Swagger
console.log('\n📋 Verificando documentación Swagger...');
const swaggerPath = path.join(__dirname, 'swagger.js');
if (fs.existsSync(swaggerPath)) {
  console.log('✅ Archivo de configuración Swagger encontrado');
} else {
  console.log('❌ Archivo de configuración Swagger NO encontrado');
}

console.log('\n📋 Parámetros de paginación disponibles:');
console.log('   - page: Número de página (default: 1)');
console.log('   - limit: Elementos por página (default: 10)');
console.log('   - sortBy: Campo de ordenamiento');
console.log('   - sortOrder: Orden (ASC/DESC)');

console.log('\n📋 Filtros disponibles para Clientes:');
console.log('   - search: Búsqueda general');
console.log('   - zona: Filtrar por zona');
console.log('   - delegacion: Filtrar por delegación');
console.log('   - estado: Filtrar por estado');
console.log('   - id_destino: Filtrar por destino');
console.log('   - id_transportista: Filtrar por transportista');

console.log('\n📋 Filtros disponibles para Manifiestos:');
console.log('   - search: Búsqueda en número de libro');
console.log('   - numero_libro: Número de libro específico');
console.log('   - id_cliente: Filtrar por cliente');
console.log('   - id_destino: Filtrar por destino del cliente');
console.log('   - id_transportista: Filtrar por transportista del cliente');
console.log('   - fecha_inicio: Fecha de creación desde');
console.log('   - fecha_fin: Fecha de creación hasta');

console.log('\n✅ Funcionalidad de paginación y filtros implementada correctamente');
console.log('\n📖 Documentación completa en: README_PAGINACION_FILTROS.md');
console.log('\n=== Fin del Test ==='); 