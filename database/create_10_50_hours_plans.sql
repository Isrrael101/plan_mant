-- ============================================
-- CREAR PLANES DE MANTENIMIENTO DE 10 Y 50 HORAS
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- Crear planes de 10 horas para todas las maquinarias que no los tengan
INSERT INTO planes_mantenimiento (maquinaria_id, nombre_plan, tipo_mantenimiento, tipo_plan, horas_operacion, intervalo_dias, descripcion, activo)
SELECT 
    m.id as maquinaria_id,
    CONCAT('PM-10H ', m.nombre) as nombre_plan,
    'PREVENTIVO' as tipo_mantenimiento,
    'POR_HORAS' as tipo_plan,
    10 as horas_operacion,
    0 as intervalo_dias,
    CONCAT('Mantenimiento preventivo de 10 horas para ', m.nombre, ' (', m.codigo, '). Inspección visual y verificación de niveles básicos.') as descripcion,
    TRUE as activo
FROM maquinaria m
WHERE m.id NOT IN (
    SELECT DISTINCT maquinaria_id 
    FROM planes_mantenimiento 
    WHERE tipo_mantenimiento = 'PREVENTIVO' 
    AND horas_operacion = 10
);

-- Crear planes de 50 horas para todas las maquinarias que no los tengan
INSERT INTO planes_mantenimiento (maquinaria_id, nombre_plan, tipo_mantenimiento, tipo_plan, horas_operacion, intervalo_dias, descripcion, activo)
SELECT 
    m.id as maquinaria_id,
    CONCAT('PM-50H ', m.nombre) as nombre_plan,
    'PREVENTIVO' as tipo_mantenimiento,
    'POR_HORAS' as tipo_plan,
    50 as horas_operacion,
    0 as intervalo_dias,
    CONCAT('Mantenimiento preventivo de 50 horas para ', m.nombre, ' (', m.codigo, '). Incluye revisión de filtros, lubricación y sistemas básicos.') as descripcion,
    TRUE as activo
FROM maquinaria m
WHERE m.id NOT IN (
    SELECT DISTINCT maquinaria_id 
    FROM planes_mantenimiento 
    WHERE tipo_mantenimiento = 'PREVENTIVO' 
    AND horas_operacion = 50
);

SELECT 'Planes de 10 y 50 horas creados' AS resultado;
SELECT COUNT(*) as planes_10h FROM planes_mantenimiento WHERE tipo_mantenimiento = 'PREVENTIVO' AND horas_operacion = 10;
SELECT COUNT(*) as planes_50h FROM planes_mantenimiento WHERE tipo_mantenimiento = 'PREVENTIVO' AND horas_operacion = 50;

