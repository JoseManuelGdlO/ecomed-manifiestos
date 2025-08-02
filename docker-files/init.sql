-- Script de inicialización para la base de datos Ecomed
-- Este script se ejecuta automáticamente al crear el contenedor

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ecomed_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE ecomed_db;

-- Crear usuario si no existe (opcional, ya que se crea con variables de entorno)
-- CREATE USER IF NOT EXISTS 'ecomed_user'@'%' IDENTIFIED BY 'ecomed123';
-- GRANT ALL PRIVILEGES ON ecomed_db.* TO 'ecomed_user'@'%';
-- FLUSH PRIVILEGES;

-- Mensaje de confirmación
SELECT 'Base de datos Ecomed inicializada correctamente' AS status; 