# Carga Masiva de Clientes - API Ecomed

## Descripción
Este endpoint permite cargar múltiples clientes desde un archivo CSV o Excel de manera masiva.

## Endpoint
```
POST /api/clientes/bulk-upload
```

## Autenticación
- Requiere token JWT válido
- Solo usuarios con rol 'admin' pueden usar esta funcionalidad

## Formato de Archivo

### Archivos Soportados
- **CSV** (.csv)
- **Excel** (.xlsx, .xls)

### Tamaño Máximo
- 10MB por archivo

### Estructura del Archivo

El archivo debe contener las siguientes columnas:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| numero_registro_ambiental | String | ✅ | Número de registro ambiental único |
| nombre_razon_social | String | ✅ | Nombre o razón social de la empresa |
| codigo_postal | String | ❌ | Código postal |
| calle | String | ❌ | Nombre de la calle |
| num_ext | String | ❌ | Número exterior |
| num_int | String | ❌ | Número interior |
| colonia | String | ❌ | Colonia |
| delegacion | String | ❌ | Delegación o municipio |
| estado | String | ❌ | Estado |
| telefono | String | ❌ | Número de teléfono |
| correo | String | ❌ | Correo electrónico |
| zona | String | ❌ | Zona geográfica |
| id_destino | Integer | ❌ | ID del destino (debe existir) |
| id_transportista | Integer | ❌ | ID del transportista (debe existir) |

### Ejemplo de CSV
```csv
numero_registro_ambiental,nombre_razon_social,codigo_postal,calle,num_ext,num_int,colonia,delegacion,estado,telefono,correo,zona,id_destino,id_transportista
RAMA-001-2024,Empresa Industrial del Norte S.A. de C.V.,12345,Av. Industrial,123,A,Parque Industrial Norte,Cuauhtémoc,CDMX,555-123-4567,contacto@empresanorte.com,Zona Norte,1,1
RAMA-002-2024,Comercial del Sur S.A. de C.V.,54321,Calle Comercial,456,B,Centro Comercial Sur,Tlalpan,CDMX,555-234-5678,info@comercialsur.com,Zona Sur,1,1
```

## Uso

### 1. Preparar el Archivo
- Asegúrate de que el archivo tenga la estructura correcta
- Los campos requeridos deben estar completos
- Los IDs de destino y transportista deben existir en la base de datos

### 2. Hacer la Petición
```bash
curl -X POST \
  http://localhost:3000/api/clientes/bulk-upload \
  -H 'Authorization: Bearer TU_TOKEN_JWT' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@ruta/al/archivo.csv'
```

### 3. Ejemplo con JavaScript/Fetch
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/api/clientes/bulk-upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## Respuesta

### Éxito (200)
```json
{
  "success": true,
  "message": "Procesamiento completado. 3 clientes creados exitosamente, 1 fallido",
  "data": {
    "total": 4,
    "exitosos": 3,
    "fallidos": 1,
    "detalles_exitosos": [
      {
        "fila": 1,
        "id": 1,
        "nombre_razon_social": "Empresa Industrial del Norte S.A. de C.V."
      }
    ],
    "detalles_fallidos": [
      {
        "fila": 2,
        "datos": {...},
        "error": "Cliente ya existe con ese número de registro ambiental"
      }
    ]
  }
}
```

### Error (400)
```json
{
  "success": false,
  "message": "El archivo es demasiado grande. Máximo 10MB permitido."
}
```

## Validaciones

### Validaciones Automáticas
1. **Campos Requeridos**: `numero_registro_ambiental` y `nombre_razon_social`
2. **Duplicados**: No se permiten números de registro ambiental duplicados
3. **Formato**: Solo archivos CSV y Excel válidos
4. **Tamaño**: Máximo 10MB

### Procesamiento
- Los clientes se procesan uno por uno
- Si un cliente falla, continúa con el siguiente
- Se reportan todos los éxitos y fallos
- Los archivos temporales se eliminan automáticamente

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Faltan campos requeridos" | Campos obligatorios vacíos | Completar `numero_registro_ambiental` y `nombre_razon_social` |
| "Cliente ya existe" | Número de registro duplicado | Usar un número único o actualizar el cliente existente |
| "Formato no soportado" | Archivo con extensión incorrecta | Usar solo .csv, .xlsx o .xls |
| "Archivo demasiado grande" | Archivo mayor a 10MB | Reducir el tamaño del archivo |

## Notas Importantes

1. **Backup**: Siempre haz backup de tu base de datos antes de cargas masivas
2. **Pruebas**: Prueba con un archivo pequeño antes de cargar muchos registros
3. **IDs**: Asegúrate de que los IDs de destino y transportista existan
4. **Formato**: Usa UTF-8 para caracteres especiales
5. **Headers**: La primera fila debe contener los nombres de las columnas

## Archivo de Ejemplo

Se incluye un archivo `ejemplo_clientes.csv` con datos de muestra para pruebas. 