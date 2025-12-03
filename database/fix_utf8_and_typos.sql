-- ============================================
-- Script para corregir UTF-8 y errores ortográficos
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

USE mtto_db;

-- ============================================
-- CORREGIR MAQUINARIA
-- ============================================
UPDATE maquinaria SET nombre = 'Grúa Doosan GMK4100' WHERE codigo = 'EQ-003';
UPDATE maquinaria SET nombre = 'Grúa Case RT890E' WHERE codigo = 'EQ-004';
UPDATE maquinaria SET nombre = 'Grúa Doosan LTM 1050' WHERE codigo = 'EQ-028';
UPDATE maquinaria SET nombre = 'Grúa Volvo LTM 1100' WHERE codigo = 'EQ-045';
UPDATE maquinaria SET nombre = 'Grúa Komatsu LTM 1100' WHERE codigo = 'EQ-046';

-- ============================================
-- CORREGIR HERRAMIENTAS
-- ============================================
UPDATE herramientas SET nombre = 'Torquímetro' WHERE codigo = 'HER-008';
UPDATE herramientas SET nombre = 'Micrómetro' WHERE codigo = 'HER-010';

-- ============================================
-- CORREGIR INSUMOS
-- ============================================
UPDATE insumos SET nombre = 'Aceite Hidráulico ISO 46' WHERE codigo = 'INS-002';
UPDATE insumos SET nombre = 'Aceite Transmisión' WHERE codigo = 'INS-003';

-- ============================================
-- CORREGIR PERSONAL (nombres y cargos)
-- ============================================
-- Los nombres ya están correctos, solo asegurar encoding
-- Corregir cargos con acentos
UPDATE personal SET cargo = 'Mecánico Junior' WHERE cargo LIKE '%Mec%nico Junior%' OR cargo LIKE '%Mecanico Junior%';
UPDATE personal SET cargo = 'Mecánico Senior' WHERE cargo LIKE '%Mec%nico Senior%' OR cargo LIKE '%Mecanico Senior%';
UPDATE personal SET cargo = 'Técnico Hidráulico' WHERE cargo LIKE '%T%cnico Hidr%ulico%' OR cargo LIKE '%Tecnico Hidraulico%';
UPDATE personal SET cargo = 'Técnico en Motores' WHERE cargo LIKE '%T%cnico en Motores%' OR cargo LIKE '%Tecnico en Motores%';

-- ============================================
-- VERIFICAR Y CORREGIR TODAS LAS TABLAS
-- ============================================
-- Asegurar que todas las columnas de texto usen utf8mb4
ALTER TABLE maquinaria CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE personal CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE herramientas CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE insumos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE planes_mantenimiento CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE actividades_mantenimiento CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE mantenimientos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Solo convertir tablas que existen
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'mtto_db' AND table_name = 'checklists_maquinaria');
SET @sql = IF(@table_exists > 0, 'ALTER TABLE checklists_maquinaria CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', 'SELECT "Tabla checklists_maquinaria no existe" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'mtto_db' AND table_name = 'daily_reports');
SET @sql = IF(@table_exists > 0, 'ALTER TABLE daily_reports CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', 'SELECT "Tabla daily_reports no existe" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'mtto_db' AND table_name = 'work_orders');
SET @sql = IF(@table_exists > 0, 'ALTER TABLE work_orders CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', 'SELECT "Tabla work_orders no existe" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================
SELECT 'Datos corregidos exitosamente' AS resultado;

