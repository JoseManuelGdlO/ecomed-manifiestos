# 🐳 Configuración Docker para Ecomed

Este documento explica cómo configurar y ejecutar la aplicación Ecomed usando Docker.

## 📋 Prerrequisitos

- Docker instalado
- Docker Compose instalado

## 🚀 Inicio Rápido

### 1. Solo Base de Datos MySQL

Para ejecutar únicamente la base de datos MySQL:

```bash
# Construir y ejecutar solo MySQL
docker-compose up mysql

# O en segundo plano
docker-compose up -d mysql
```

### 2. Aplicación Completa (MySQL + Backend)

Para ejecutar tanto la base de datos como el backend:

```bash
# Construir y ejecutar todos los servicios
docker-compose up

# O en segundo plano
docker-compose up -d
```

## 🔧 Configuración

### Variables de Entorno

Las credenciales de la base de datos están configuradas en el `docker-compose.yml`:

```yaml
environment:
  MYSQL_ROOT_PASSWORD: root123
  MYSQL_DATABASE: ecomed_db
  MYSQL_USER: ecomed_user
  MYSQL_PASSWORD: ecomed123
```

### Puertos

- **MySQL**: `3306`
- **Backend API**: `3000`

## 📁 Estructura de Archivos Docker

```
├── Dockerfile                 # Dockerfile para MySQL
├── docker-compose.yml         # Configuración de servicios
├── mysql.cnf                  # Configuración de MySQL
├── init.sql                   # Script de inicialización
├── .dockerignore              # Archivos a ignorar
├── backend/
│   └── Dockerfile            # Dockerfile para Backend
└── README-Docker.md          # Este archivo
```

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Ver logs de MySQL
docker-compose logs mysql

# Ver logs del backend
docker-compose logs backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache
```

### Acceso a MySQL

```bash
# Conectar a MySQL desde el host
mysql -h localhost -P 3306 -u ecomed_user -p ecomed_db

# Conectar como root
mysql -h localhost -P 3306 -u root -p

# Acceder al contenedor MySQL
docker exec -it ecomed_mysql mysql -u ecomed_user -p ecomed_db
```

### Backup y Restore

```bash
# Crear backup de la base de datos
docker exec ecomed_mysql mysqldump -u ecomed_user -p ecomed_db > backup.sql

# Restaurar backup
docker exec -i ecomed_mysql mysql -u ecomed_user -p ecomed_db < backup.sql
```

## 🔍 Verificación

### Verificar que MySQL esté funcionando

```bash
# Verificar contenedor
docker ps

# Verificar logs
docker-compose logs mysql

# Probar conexión
docker exec ecomed_mysql mysql -u ecomed_user -p -e "SHOW DATABASES;"
```

### Verificar que el Backend esté funcionando

```bash
# Verificar API
curl http://localhost:3000

# Verificar logs del backend
docker-compose logs backend
```

## 🚨 Solución de Problemas

### Error de Conexión a MySQL

1. Verificar que el contenedor esté ejecutándose:
   ```bash
   docker ps
   ```

2. Verificar logs de MySQL:
   ```bash
   docker-compose logs mysql
   ```

3. Verificar configuración de red:
   ```bash
   docker network ls
   ```

### Error de Permisos

Si hay problemas de permisos con volúmenes:

```bash
# Cambiar permisos del directorio de datos
sudo chown -R 999:999 ./mysql_data
```

### Reiniciar Servicios

```bash
# Reiniciar solo MySQL
docker-compose restart mysql

# Reiniciar todo
docker-compose restart
```

## 📝 Notas Importantes

- Los datos de MySQL se almacenan en un volumen persistente
- El script `init.sql` se ejecuta automáticamente al crear el contenedor
- La configuración de MySQL está optimizada para desarrollo
- El backend se conecta automáticamente a MySQL usando las variables de entorno

## 🔐 Seguridad

⚠️ **Importante**: Las credenciales en este archivo son para desarrollo. Para producción:

1. Cambia todas las contraseñas
2. Usa variables de entorno seguras
3. Configura firewalls apropiados
4. Usa certificados SSL/TLS 