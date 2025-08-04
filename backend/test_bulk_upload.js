const fs = require('fs');
const path = require('path');

// Script de prueba para la carga masiva de clientes
console.log('=== Test de Carga Masiva de Clientes ===\n');

// Verificar que existe el archivo de ejemplo
const ejemploPath = path.join(__dirname, 'ejemplo_clientes.csv');
if (fs.existsSync(ejemploPath)) {
  console.log('✅ Archivo de ejemplo encontrado:', ejemploPath);
  
  // Leer y mostrar el contenido del archivo
  const contenido = fs.readFileSync(ejemploPath, 'utf8');
  const lineas = contenido.split('\n');
  
  console.log('\n📋 Contenido del archivo de ejemplo:');
  console.log('Primera línea (headers):', lineas[0]);
  console.log('Registros de ejemplo:', lineas.length - 1);
  
  // Mostrar un ejemplo de registro
  if (lineas.length > 1) {
    const campos = lineas[0].split(',');
    const valores = lineas[1].split(',');
    console.log('\n📝 Ejemplo de registro:');
    campos.forEach((campo, index) => {
      console.log(`  ${campo}: ${valores[index] || 'N/A'}`);
    });
  }
} else {
  console.log('❌ Archivo de ejemplo no encontrado');
}

// Verificar que existe el directorio uploads
const uploadsPath = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsPath)) {
  console.log('\n✅ Directorio uploads encontrado:', uploadsPath);
} else {
  console.log('\n❌ Directorio uploads no encontrado');
  console.log('Creando directorio uploads...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Directorio uploads creado');
}

// Verificar dependencias instaladas
console.log('\n📦 Verificando dependencias:');
const packageJson = require('./package.json');
const dependenciasRequeridas = ['multer', 'csv-parser', 'xlsx'];

dependenciasRequeridas.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`  ❌ ${dep}: No instalada`);
  }
});

console.log('\n🚀 Instrucciones para probar:');
console.log('1. Inicia el servidor: npm run dev');
console.log('2. Obtén un token JWT válido (login)');
console.log('3. Usa el endpoint: POST /api/clientes/bulk-upload');
console.log('4. Sube el archivo ejemplo_clientes.csv');
console.log('5. Verifica la respuesta en la consola');

console.log('\n📖 Documentación completa en: README_CARGA_MASIVA.md');
console.log('\n=== Fin del Test ==='); 