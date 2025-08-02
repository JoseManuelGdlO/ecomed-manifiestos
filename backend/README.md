# API Backend - Ecomed

API RESTful construida con Express.js, Sequelize ORM y JWT para autenticación.

## 🚀 Características

- **Express.js**: Framework web para Node.js
- **Sequelize**: ORM para MySQL
- **JWT**: Autenticación con tokens
- **bcryptjs**: Encriptación de contraseñas
- **express-validator**: Validación de datos
- **CORS**: Soporte para peticiones cross-origin

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Edita el archivo `config.env` con tus credenciales de base de datos:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=ecomed_db
DB_PORT=3306
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

4. **Crear la base de datos**
```sql
CREATE DATABASE ecomed_db;
```

5. **Ejecutar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📊 Estructura de la Base de Datos

### Tabla: `roles`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| nombre | VARCHAR(50) | Nombre del rol (único) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `usuarios`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| nombre_completo | VARCHAR(100) | Nombre completo del usuario |
| correo | VARCHAR(100) | Correo electrónico (único) |
| contrasena | VARCHAR(255) | Contraseña encriptada |
| id_rol | INT | Clave foránea a roles.id |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `residuos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| nombre | VARCHAR(100) | Nombre del residuo |
| descripcion | TEXT | Descripción del residuo |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `destinos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| nombre | VARCHAR(100) | Nombre del destino |
| descripcion | TEXT | Descripción del destino |
| razon_social | VARCHAR(200) | Razón social de la empresa |
| codigo_postal | VARCHAR(10) | Código postal |
| calle | VARCHAR(100) | Nombre de la calle |
| num_ext | VARCHAR(20) | Número exterior |
| num_int | VARCHAR(20) | Número interior (opcional) |
| colonia | VARCHAR(100) | Colonia |
| delegacion | VARCHAR(100) | Delegación o municipio |
| estado | VARCHAR(100) | Estado |
| telefono | VARCHAR(20) | Teléfono de contacto |
| correo_electronico | VARCHAR(100) | Correo electrónico (opcional) |
| autorizacion_semarnat | VARCHAR(50) | Número de autorización SEMARNAT |
| nombre_encargado | VARCHAR(100) | Nombre del encargado (opcional) |
| cargo_encargado | VARCHAR(100) | Cargo del encargado (opcional) |
| observaciones | TEXT | Observaciones adicionales (opcional) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `transportistas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| razon_social | VARCHAR(200) | Razón social de la empresa |
| codigo_postal | VARCHAR(10) | Código postal |
| calle | VARCHAR(100) | Nombre de la calle |
| num_ext | VARCHAR(20) | Número exterior |
| num_int | VARCHAR(20) | Número interior (opcional) |
| colonia | VARCHAR(100) | Colonia |
| delegacion | VARCHAR(100) | Delegación o municipio |
| estado | VARCHAR(100) | Estado |
| telefono | VARCHAR(20) | Teléfono de contacto |
| correo_electronico | VARCHAR(100) | Correo electrónico (opcional) |
| autorizacion_semarnat | VARCHAR(50) | Número de autorización SEMARNAT |
| permiso_sct | VARCHAR(50) | Número de permiso SCT |
| tipo_vehiculo | VARCHAR(100) | Tipo de vehículo |
| placa | VARCHAR(20) | Número de placa |
| ruta_empresa | VARCHAR(200) | Ruta de la empresa |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `clientes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| numero_registro_ambiental | VARCHAR(50) | Número de registro ambiental (opcional) |
| nombre_razon_social | VARCHAR(200) | Nombre o razón social |
| codigo_postal | VARCHAR(10) | Código postal |
| calle | VARCHAR(100) | Nombre de la calle |
| num_ext | VARCHAR(20) | Número exterior |
| num_int | VARCHAR(20) | Número interior (opcional) |
| colonia | VARCHAR(100) | Colonia |
| delegacion | VARCHAR(100) | Delegación o municipio |
| estado | VARCHAR(100) | Estado |
| telefono | VARCHAR(20) | Teléfono (opcional) |
| correo | VARCHAR(100) | Correo electrónico (opcional) |
| zona | VARCHAR(100) | Zona |
| id_destino | INT | Clave foránea a destinos.id |
| id_transportista | INT | Clave foránea a transportistas.id |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `manifiestos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| numero_libro | VARCHAR(50) | Número de libro (único) |
| id_cliente | INT | Clave foránea a clientes.id |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `manifiesto_residuos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| id_manifiesto | INT | Clave foránea a manifiestos.id |
| id_residuo | INT | Clave foránea a residuos.id |
| cantidad | DECIMAL(10,2) | Cantidad del residuo |
| unidad_medida | VARCHAR(20) | Unidad de medida (kg, ton, etc.) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `manifiesto_estados`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| id_manifiesto | INT | Clave foránea a manifiestos.id |
| esta_capturado | BOOLEAN | Indica si el manifiesto está capturado |
| esta_entregado | BOOLEAN | Indica si el manifiesto está entregado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

### Tabla: `vehiculos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria, autoincremental |
| marca | VARCHAR(50) | Marca del vehículo |
| nombre | VARCHAR(100) | Nombre del vehículo |
| descripcion | TEXT | Descripción del vehículo |
| placa | VARCHAR(20) | Placa del vehículo (opcional) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (baja lógica) |

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Los tokens deben incluirse en el header `Authorization` de las peticiones:

```
Authorization: Bearer <token>
```

## 🗑️ Baja Lógica (Soft Delete)

La API implementa baja lógica para usuarios, roles, residuos, destinos y vehículos, lo que significa que:

- **Eliminación normal**: Los registros se marcan como eliminados (`deleted_at` se establece) pero permanecen en la base de datos
- **Restauración**: Los registros eliminados pueden ser restaurados
- **Eliminación permanente**: Solo los administradores pueden eliminar registros permanentemente
- **Consultas por defecto**: Solo muestran registros activos (no eliminados)

### Comportamiento de la Baja Lógica:

1. **DELETE normal**: Marca el registro como eliminado (baja lógica)
2. **PATCH /restore**: Restaura un registro eliminado
3. **DELETE /force**: Elimina permanentemente el registro
4. **GET /deleted**: Lista solo registros eliminados

## 📚 Endpoints de la API

### Autenticación

#### POST `/api/auth/login`
Iniciar sesión de usuario.

**Body:**
```json
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "nombre_completo": "Juan Pérez",
      "correo": "usuario@ejemplo.com",
      "id_rol": 1,
      "rol": {
        "id": 1,
        "nombre": "admin"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/auth/register`
Registrar nuevo usuario.

**Body:**
```json
{
  "nombre_completo": "Juan Pérez",
  "correo": "usuario@ejemplo.com",
  "contrasena": "123456",
  "id_rol": 1
}
```

#### GET `/api/auth/profile`
Obtener perfil del usuario autenticado (requiere token).

### Usuarios

#### GET `/api/users`
Obtener todos los usuarios activos (requiere autenticación).

#### GET `/api/users/deleted`
Obtener usuarios eliminados (requiere rol admin).

#### GET `/api/users/:id`
Obtener usuario por ID (requiere autenticación).

#### POST `/api/users`
Crear nuevo usuario (requiere rol admin).

**Body:**
```json
{
  "nombre_completo": "Nuevo Usuario",
  "correo": "nuevo@ejemplo.com",
  "contrasena": "123456",
  "id_rol": 1
}
```

#### PUT `/api/users/:id`
Actualizar usuario (requiere rol admin).

#### DELETE `/api/users/:id`
Eliminar usuario (baja lógica, requiere rol admin).

#### PATCH `/api/users/:id/restore`
Restaurar usuario eliminado (requiere rol admin).

#### DELETE `/api/users/:id/force`
Eliminar usuario permanentemente (requiere rol admin).

### Roles

#### GET `/api/roles`
Obtener todos los roles activos (requiere autenticación).

#### GET `/api/roles/deleted`
Obtener roles eliminados (requiere rol admin).

#### GET `/api/roles/:id`
Obtener rol por ID (requiere autenticación).

#### POST `/api/roles`
Crear nuevo rol (requiere rol admin).

**Body:**
```json
{
  "nombre": "editor"
}
```

#### PUT `/api/roles/:id`
Actualizar rol (requiere rol admin).

#### DELETE `/api/roles/:id`
Eliminar rol (baja lógica, requiere rol admin).

#### PATCH `/api/roles/:id/restore`
Restaurar rol eliminado (requiere rol admin).

#### DELETE `/api/roles/:id/force`
Eliminar rol permanentemente (requiere rol admin).

### Residuos

#### GET `/api/residuos`
Obtener todos los residuos activos (requiere autenticación).

#### GET `/api/residuos/deleted`
Obtener residuos eliminados (requiere rol admin).

#### GET `/api/residuos/:id`
Obtener residuo por ID (requiere autenticación).

#### POST `/api/residuos`
Crear nuevo residuo (requiere rol admin).

**Body:**
```json
{
  "nombre": "Papel y Cartón",
  "descripcion": "Residuos de papel, cartón, periódicos, revistas y embalajes de papel"
}
```

#### PUT `/api/residuos/:id`
Actualizar residuo (requiere rol admin).

#### DELETE `/api/residuos/:id`
Eliminar residuo (baja lógica, requiere rol admin).

#### PATCH `/api/residuos/:id/restore`
Restaurar residuo eliminado (requiere rol admin).

#### DELETE `/api/residuos/:id/force`
Eliminar residuo permanentemente (requiere rol admin).

### Destinos

#### GET `/api/destinos`
Obtener todos los destinos activos (requiere autenticación).

#### GET `/api/destinos/deleted`
Obtener destinos eliminados (requiere rol admin).

#### GET `/api/destinos/:id`
Obtener destino por ID (requiere autenticación).

#### POST `/api/destinos`
Crear nuevo destino (requiere rol admin).

**Body:**
```json
{
  "nombre": "Centro de Reciclaje Metropolitano",
  "descripcion": "Centro de reciclaje para procesamiento de materiales reutilizables",
  "razon_social": "Reciclaje Metropolitano S.A. de C.V.",
  "codigo_postal": "07700",
  "calle": "Av. Industrial",
  "num_ext": "1234",
  "num_int": "A",
  "colonia": "Industrial",
  "delegacion": "Gustavo A. Madero",
  "estado": "Ciudad de México",
  "telefono": "5555-123-4567",
  "correo_electronico": "info@reciclajemetropolitano.com",
  "autorizacion_semarnat": "SEMARNAT-2024-001",
  "nombre_encargado": "Ing. Carlos Mendoza",
  "cargo_encargado": "Director General",
  "observaciones": "Centro autorizado para reciclaje de papel, plástico y metales"
}
```

#### PUT `/api/destinos/:id`
Actualizar destino (requiere rol admin).

#### DELETE `/api/destinos/:id`
Eliminar destino (baja lógica, requiere rol admin).

#### PATCH `/api/destinos/:id/restore`
Restaurar destino eliminado (requiere rol admin).

#### DELETE `/api/destinos/:id/force`
Eliminar destino permanentemente (requiere rol admin).

### Vehículos

#### GET `/api/vehiculos`
Obtener todos los vehículos activos (requiere autenticación).

#### GET `/api/vehiculos/deleted`
Obtener vehículos eliminados (requiere rol admin).

#### GET `/api/vehiculos/:id`
Obtener vehículo por ID (requiere autenticación).

#### POST `/api/vehiculos`
Crear nuevo vehículo (requiere rol admin).

**Body:**
```json
{
  "marca": "Toyota",
  "nombre": "Camión de Recolección",
  "descripcion": "Camión para recolección de residuos urbanos",
  "placa": "ABC-123"
}
```

#### PUT `/api/vehiculos/:id`
Actualizar vehículo (requiere rol admin).

#### DELETE `/api/vehiculos/:id`
Eliminar vehículo (baja lógica, requiere rol admin).

#### PATCH `/api/vehiculos/:id/restore`
Restaurar vehículo eliminado (requiere rol admin).

#### DELETE `/api/vehiculos/:id/force`
Eliminar vehículo permanentemente (requiere rol admin).

### Transportistas

#### GET `/api/transportistas`
Obtener todos los transportistas activos (requiere autenticación).

#### GET `/api/transportistas/deleted`
Obtener transportistas eliminados (requiere rol admin).

#### GET `/api/transportistas/:id`
Obtener transportista por ID (requiere autenticación).

#### POST `/api/transportistas`
Crear nuevo transportista (requiere rol admin).

**Body:**
```json
{
  "razon_social": "Transportes Ecológicos del Valle S.A. de C.V.",
  "codigo_postal": "07700",
  "calle": "Av. Industrial",
  "num_ext": "567",
  "num_int": "A",
  "colonia": "Industrial",
  "delegacion": "Gustavo A. Madero",
  "estado": "Ciudad de México",
  "telefono": "5555-111-2222",
  "correo_electronico": "contacto@transportesecologicos.com",
  "autorizacion_semarnat": "SEMARNAT-TRANS-2024-001",
  "permiso_sct": "SCT-TRANS-2024-001",
  "tipo_vehiculo": "Camión de Carga",
  "placa": "ABC-123",
  "ruta_empresa": "Ruta Norte - Centro de Reciclaje"
}
```

#### PUT `/api/transportistas/:id`
Actualizar transportista (requiere rol admin).

#### DELETE `/api/transportistas/:id`
Eliminar transportista (baja lógica, requiere rol admin).

#### PATCH `/api/transportistas/:id/restore`
Restaurar transportista eliminado (requiere rol admin).

#### DELETE `/api/transportistas/:id/force`
Eliminar transportista permanentemente (requiere rol admin).

### Clientes

#### GET `/api/clientes`
Obtener todos los clientes activos (requiere autenticación).

#### GET `/api/clientes/deleted`
Obtener clientes eliminados (requiere rol admin).

#### GET `/api/clientes/:id`
Obtener cliente por ID (requiere autenticación).

#### POST `/api/clientes`
Crear nuevo cliente (requiere rol admin).

**Body:**
```json
{
  "numero_registro_ambiental": "RA-2024-001",
  "nombre_razon_social": "Industrias del Norte S.A. de C.V.",
  "codigo_postal": "07700",
  "calle": "Av. Industrial",
  "num_ext": "100",
  "num_int": "A",
  "colonia": "Industrial",
  "delegacion": "Gustavo A. Madero",
  "estado": "Ciudad de México",
  "telefono": "5555-111-0001",
  "correo": "contacto@industriasnorte.com",
  "zona": "Zona Norte",
  "id_destino": 1,
  "id_transportista": 1
}
```

#### PUT `/api/clientes/:id`
Actualizar cliente (requiere rol admin).

#### DELETE `/api/clientes/:id`
Eliminar cliente (baja lógica, requiere rol admin).

#### PATCH `/api/clientes/:id/restore`
Restaurar cliente eliminado (requiere rol admin).

#### DELETE `/api/clientes/:id/force`
Eliminar cliente permanentemente (requiere rol admin).

### Manifiestos

#### GET `/api/manifiestos`
Obtener todos los manifiestos activos (requiere autenticación).

#### GET `/api/manifiestos/deleted`
Obtener manifiestos eliminados (requiere rol admin).

#### GET `/api/manifiestos/:id`
Obtener manifiesto por ID (requiere autenticación).

#### POST `/api/manifiestos`
Crear nuevo manifiesto (requiere rol admin).

**Body:**
```json
{
  "numero_libro": "LIB-2024-001",
  "id_cliente": 1,
  "residuos": [
    {
      "id_residuo": 1,
      "cantidad": 500.50,
      "unidad_medida": "kg"
    },
    {
      "id_residuo": 2,
      "cantidad": 250.25,
      "unidad_medida": "kg"
    }
  ]
}
```

#### PUT `/api/manifiestos/:id`
Actualizar manifiesto (requiere rol admin).

#### DELETE `/api/manifiestos/:id`
Eliminar manifiesto (baja lógica, requiere rol admin).

#### PATCH `/api/manifiestos/:id/restore`
Restaurar manifiesto eliminado (requiere rol admin).

#### DELETE `/api/manifiestos/:id/force`
Eliminar manifiesto permanentemente (requiere rol admin).

### Estados de Manifiestos

#### GET `/api/manifiesto-estados`
Obtener todos los estados de manifiestos activos (requiere autenticación).

#### GET `/api/manifiesto-estados/deleted`
Obtener estados de manifiestos eliminados (requiere rol admin).

#### GET `/api/manifiesto-estados/:id`
Obtener estado de manifiesto por ID (requiere autenticación).

#### POST `/api/manifiesto-estados`
Crear nuevo estado de manifiesto (requiere rol admin).

**Body:**
```json
{
  "id_manifiesto": 1,
  "esta_capturado": true,
  "esta_entregado": false
}
```

#### PUT `/api/manifiesto-estados/:id`
Actualizar estado de manifiesto (requiere rol admin).

#### DELETE `/api/manifiesto-estados/:id`
Eliminar estado de manifiesto (baja lógica, requiere rol admin).

#### PATCH `/api/manifiesto-estados/:id/restore`
Restaurar estado de manifiesto eliminado (requiere rol admin).

#### DELETE `/api/manifiesto-estados/:id/force`
Eliminar estado de manifiesto permanentemente (requiere rol admin).

## 🔒 Control de Acceso

- **Público**: Login y registro
- **Autenticado**: Ver perfil, listar usuarios, roles, residuos, destinos, vehículos, transportistas, clientes, manifiestos y estados de manifiestos activos
- **Admin**: Crear, actualizar, eliminar (baja lógica), restaurar y eliminar permanentemente usuarios, roles, residuos, destinos, vehículos, transportistas, clientes, manifiestos y estados de manifiestos

## 📝 Códigos de Respuesta

- `200`: OK - Petición exitosa
- `201`: Created - Recurso creado exitosamente
- `400`: Bad Request - Error en los datos enviados
- `401`: Unauthorized - No autenticado
- `403`: Forbidden - No autorizado
- `404`: Not Found - Recurso no encontrado
- `500`: Internal Server Error - Error del servidor

## 🧪 Ejemplos de Uso

### 1. Crear un rol admin
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nombre": "admin"}'
```

### 2. Registrar un usuario admin
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Administrador",
    "correo": "admin@ejemplo.com",
    "contrasena": "123456",
    "id_rol": 1
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "admin@ejemplo.com",
    "contrasena": "123456"
  }'
```

## 🚨 Notas Importantes

1. **Seguridad**: Cambia el `JWT_SECRET` en producción
2. **Base de datos**: Asegúrate de que MySQL esté corriendo
3. **Puerto**: El puerto por defecto es 3000, puedes cambiarlo en `config.env`
4. **Logs**: Los logs se muestran en consola en modo desarrollo

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── roleController.js
│   ├── residuoController.js
│   ├── destinoController.js
│   ├── vehiculoController.js
│   ├── transportistaController.js
│   ├── clienteController.js
│   ├── manifiestoController.js
│   └── manifiestoEstadoController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── models/
│   ├── index.js
│   ├── Role.js
│   ├── User.js
│   ├── Residuo.js
│   ├── Destino.js
│   ├── Vehiculo.js
│   ├── Transportista.js
│   ├── Cliente.js
│   ├── Manifiesto.js
│   ├── ManifiestoResiduo.js
│   └── ManifiestoEstado.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── roles.js
│   ├── residuos.js
│   ├── destinos.js
│   ├── vehiculos.js
│   ├── transportistas.js
│   ├── clientes.js
│   ├── manifiestos.js
│   └── manifiestoEstados.js
├── config.env
├── package.json
├── README.md
└── server.js
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. 