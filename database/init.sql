-- ============================================
-- Script de inicialización de MySQL para Docker
-- ============================================

-- Crear usuario de aplicación
CREATE USER IF NOT EXISTS 'mtto_user'@'%' IDENTIFIED BY 'mtto_password';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON mtto_db.* TO 'mtto_user'@'%';
FLUSH PRIVILEGES;

-- Cargar schema
SOURCE /docker-entrypoint-initdb.d/schema.sql;

