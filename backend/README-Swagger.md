# 📚 Documentación Swagger - API Ecomed

Este documento explica cómo usar la documentación Swagger de la API Ecomed.

## 🚀 Acceso a la Documentación

Una vez que el servidor esté corriendo, puedes acceder a la documentación Swagger en:

```
http://localhost:3000/api-docs
```

## 📋 Características de la Documentación

### 🔐 Autenticación
- **Tipo**: Bearer Token (JWT)
- **Endpoint de login**: `/api/auth/login`
- **Uso**: Incluir el token en el header `Authorization: Bearer <token>`

### 📊 Endpoints Documentados

#### 1. **Autenticación**
- `POST /api/auth/login` - Iniciar sesión

#### 2. **Usuarios**
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/{id}` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario (baja lógica)
- `PATCH /api/users/{id}/restore` - Restaurar usuario
- `GET /api/users/deleted` - Obtener usuarios eliminados

#### 3. **Roles**
- `GET /api/roles` - Obtener todos los roles
- `GET /api/roles/{id}` - Obtener rol por ID
- `POST /api/roles` - Crear nuevo rol
- `PUT /api/roles/{id}` - Actualizar rol
- `DELETE /api/roles/{id}` - Eliminar rol (baja lógica)
- `PATCH /api/roles/{id}/restore` - Restaurar rol
- `GET /api/roles/deleted` - Obtener roles eliminados

#### 4. **Residuos**
- `GET /api/residuos` - Obtener todos los residuos
- `GET /api/residuos/{id}` - Obtener residuo por ID
- `POST /api/residuos` - Crear nuevo residuo
- `PUT /api/residuos/{id}` - Actualizar residuo
- `DELETE /api/residuos/{id}` - Eliminar residuo (baja lógica)
- `PATCH /api/residuos/{id}/restore` - Restaurar residuo
- `GET /api/residuos/deleted` - Obtener residuos eliminados

#### 5. **Destinos**
- `GET /api/destinos` - Obtener todos los destinos
- `GET /api/destinos/{id}` - Obtener destino por ID
- `POST /api/destinos` - Crear nuevo destino
- `PUT /api/destinos/{id}` - Actualizar destino
- `DELETE /api/destinos/{id}` - Eliminar destino (baja lógica)
- `PATCH /api/destinos/{id}/restore` - Restaurar destino
- `GET /api/destinos/deleted` - Obtener destinos eliminados

#### 6. **Vehículos**
- `GET /api/vehiculos` - Obtener todos los vehículos
- `GET /api/vehiculos/{id}` - Obtener vehículo por ID
- `POST /api/vehiculos` - Crear nuevo vehículo
- `PUT /api/vehiculos/{id}` - Actualizar vehículo
- `DELETE /api/vehiculos/{id}` - Eliminar vehículo (baja lógica)
- `PATCH /api/vehiculos/{id}/restore` - Restaurar vehículo
- `GET /api/vehiculos/deleted` - Obtener vehículos eliminados

#### 7. **Transportistas**
- `GET /api/transportistas` - Obtener todos los transportistas
- `GET /api/transportistas/{id}` - Obtener transportista por ID
- `POST /api/transportistas` - Crear nuevo transportista
- `PUT /api/transportistas/{id}` - Actualizar transportista
- `DELETE /api/transportistas/{id}` - Eliminar transportista (baja lógica)
- `PATCH /api/transportistas/{id}/restore` - Restaurar transportista
- `GET /api/transportistas/deleted` - Obtener transportistas eliminados

#### 8. **Clientes**
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/{id}` - Obtener cliente por ID
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/{id}` - Actualizar cliente
- `DELETE /api/clientes/{id}` - Eliminar cliente (baja lógica)
- `PATCH /api/clientes/{id}/restore` - Restaurar cliente
- `GET /api/clientes/deleted` - Obtener clientes eliminados

#### 9. **Manifiestos**
- `GET /api/manifiestos` - Obtener todos los manifiestos
- `GET /api/manifiestos/{id}` - Obtener manifiesto por ID
- `POST /api/manifiestos` - Crear nuevo manifiesto
- `PUT /api/manifiestos/{id}` - Actualizar manifiesto
- `DELETE /api/manifiestos/{id}` - Eliminar manifiesto (baja lógica)
- `PATCH /api/manifiestos/{id}/restore` - Restaurar manifiesto
- `GET /api/manifiestos/deleted` - Obtener manifiestos eliminados

#### 10. **Estados de Manifiestos**
- `GET /api/manifiesto-estados` - Obtener todos los estados
- `GET /api/manifiesto-estados/{id}` - Obtener estado por ID
- `POST /api/manifiesto-estados` - Crear nuevo estado
- `PUT /api/manifiesto-estados/{id}` - Actualizar estado
- `DELETE /api/manifiesto-estados/{id}` - Eliminar estado (baja lógica)
- `PATCH /api/manifiesto-estados/{id}/restore` - Restaurar estado
- `GET /api/manifiesto-estados/deleted` - Obtener estados eliminados

## 🔧 Cómo Usar Swagger

### 1. **Autenticación**
1. Ve a la sección "Autenticación"
2. Haz clic en "Try it out" en el endpoint `/api/auth/login`
3. Ingresa las credenciales:
   ```json
   {
     "correo": "admin@ecomed.com",
     "contrasena": "admin123"
   }
   ```
4. Ejecuta la petición y copia el token JWT

### 2. **Autorización**
1. Haz clic en el botón "Authorize" en la parte superior
2. Ingresa el token en el formato: `Bearer <tu_token_jwt>`
3. Haz clic en "Authorize"

### 3. **Probar Endpoints**
1. Navega a cualquier endpoint que desees probar
2. Haz clic en "Try it out"
3. Completa los parámetros requeridos
4. Ejecuta la petición
5. Revisa la respuesta

## 📝 Ejemplos de Uso

### Crear un Residuo
```json
{
  "nombre": "Aceite usado",
  "descripcion": "Aceite lubricante usado de motores"
}
```

### Crear un Cliente
```json
{
  "numero_registro_ambiental": "RA-001",
  "nombre_razon_social": "Empresa ABC S.A. de C.V.",
  "codigo_postal": "12345",
  "calle": "Av. Principal",
  "num_ext": "123",
  "colonia": "Centro",
  "delegacion": "Cuauhtémoc",
  "estado": "CDMX",
  "telefono": "5551234567",
  "correo": "contacto@empresaabc.com",
  "zona": "Norte",
  "id_destino": 1,
  "id_transportista": 1
}
```

### Crear un Manifiesto
```json
{
  "numero_libro": "LIB-2024-001",
  "id_cliente": 1,
  "residuos": [
    {
      "id_residuo": 1,
      "cantidad": 100.50,
      "unidad_medida": "kg"
    },
    {
      "id_residuo": 2,
      "cantidad": 50.25,
      "unidad_medida": "kg"
    }
  ]
}
```

## 🛠️ Configuración Técnica

### Dependencias
```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0"
}
```

### Archivos de Configuración
- `swagger.js` - Configuración principal de Swagger
- `routes/swagger.js` - Ruta para servir la documentación
- `server.js` - Integración con el servidor Express

### Estructura de Schemas
- **LoginRequest/LoginResponse** - Autenticación
- **User/Role** - Gestión de usuarios
- **Residuo/Destino/Vehiculo** - Catálogos
- **Transportista/Cliente** - Entidades principales
- **Manifiesto/ManifiestoResiduo/ManifiestoEstado** - Sistema de manifiestos
- **ErrorResponse** - Respuestas de error

## 🔍 Características Avanzadas

### Filtros y Búsquedas
- Los endpoints GET soportan parámetros de consulta
- Paginación automática en listados
- Filtros por campos específicos

### Validaciones
- Validación automática de datos de entrada
- Mensajes de error descriptivos
- Validación de tipos de datos

### Seguridad
- Autenticación JWT requerida
- Autorización por roles
- Validación de permisos

## 🚨 Solución de Problemas

### Error 401 - No Autorizado
- Verifica que el token JWT sea válido
- Asegúrate de incluir "Bearer " antes del token
- Revisa que el token no haya expirado

### Error 403 - Prohibido
- Verifica que tu usuario tenga el rol requerido
- Contacta al administrador para asignar permisos

### Error 404 - No Encontrado
- Verifica que el ID del recurso exista
- Revisa que la URL del endpoint sea correcta

### Error 422 - Datos Inválidos
- Revisa el formato de los datos enviados
- Verifica que todos los campos requeridos estén presentes
- Comprueba que los tipos de datos sean correctos

## 📞 Soporte

Para soporte técnico o reportar problemas con la documentación:

- **Email**: support@ecomed.com
- **Documentación**: http://localhost:3000/api-docs
- **API Status**: http://localhost:3000/ 