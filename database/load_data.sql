-- ============================================
-- Script para cargar datos desde archivos CSV
-- MTTO Pro - Sistema de Gestión de Mantenimiento
-- ============================================

USE mtto_db;

-- Deshabilitar verificaciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- Cargar datos de Maquinaria
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/01_maquinaria.csv'
INTO TABLE maquinaria
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales);

-- ============================================
-- Cargar datos de Personal
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/02_personal.csv'
INTO TABLE personal
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado);

-- ============================================
-- Cargar datos de Herramientas
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/03_herramientas.csv'
INTO TABLE herramientas
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, codigo, nombre, marca, estado, categoria, costo);

-- ============================================
-- Cargar datos de Insumos
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/04_insumos.csv'
INTO TABLE insumos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, codigo, nombre, unidad, precio_unitario, cantidad, stock_minimo, categoria);

-- ============================================
-- Cargar datos de Planes de Mantenimiento
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/05_planes_mantenimiento.csv'
INTO TABLE planes_mantenimiento
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, maquinaria_id, nombre_plan, tipo_mantenimiento, tipo_plan, @horas_operacion, @intervalo_dias, descripcion, activo)
SET horas_operacion = NULLIF(@horas_operacion, ''),
    intervalo_dias = NULLIF(@intervalo_dias, 'NULL');

-- ============================================
-- Cargar datos de Actividades de Mantenimiento
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/06_actividades_mantenimiento.csv'
INTO TABLE actividades_mantenimiento
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado);

-- ============================================
-- Cargar datos de Insumos por Actividad
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/07_actividad_insumos.csv'
INTO TABLE actividad_insumos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, actividad_id, @insumo_id, cantidad, unidad, especificaciones, costo_unitario)
SET insumo_id = NULLIF(@insumo_id, 'NULL');

-- ============================================
-- Cargar datos de Herramientas por Actividad
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/08_actividad_herramientas.csv'
INTO TABLE actividad_herramientas
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, actividad_id, @herramienta_id, cantidad, especificaciones)
SET herramienta_id = NULLIF(@herramienta_id, 'NULL');

-- ============================================
-- Cargar datos de Mantenimientos
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/09_mantenimientos.csv'
INTO TABLE mantenimientos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, maquinaria_id, @plan_id, tipo_mantenimiento, @fecha_programada, @fecha_ejecucion, horas_maquina, estado, observaciones, costo_mano_obra, costo_insumos)
SET plan_id = NULLIF(@plan_id, 'NULL'),
    fecha_programada = NULLIF(@fecha_programada, 'NULL'),
    fecha_ejecucion = NULLIF(@fecha_ejecucion, 'NULL');

-- ============================================
-- Cargar datos de Personal Asignado a Mantenimiento
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/10_mantenimiento_personal.csv'
INTO TABLE mantenimiento_personal
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, mantenimiento_id, personal_id, horas_trabajadas, tarifa_aplicada);

-- ============================================
-- Cargar datos de Insumos Utilizados en Mantenimiento
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/11_mantenimiento_insumos.csv'
INTO TABLE mantenimiento_insumos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, mantenimiento_id, insumo_id, cantidad_usada, unidad, precio_unitario);

-- ============================================
-- Cargar datos de Actividades Ejecutadas en Mantenimiento
-- ============================================
LOAD DATA LOCAL INFILE 'database/data/12_mantenimiento_actividades.csv'
INTO TABLE mantenimiento_actividades
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, mantenimiento_id, @actividad_id, descripcion, tiempo_real, completada, observaciones)
SET actividad_id = NULLIF(@actividad_id, 'NULL');

-- Habilitar verificaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar datos cargados
SELECT 'Maquinaria' as tabla, COUNT(*) as registros FROM maquinaria
UNION ALL
SELECT 'Personal', COUNT(*) FROM personal
UNION ALL
SELECT 'Herramientas', COUNT(*) FROM herramientas
UNION ALL
SELECT 'Insumos', COUNT(*) FROM insumos
UNION ALL
SELECT 'Planes Mantenimiento', COUNT(*) FROM planes_mantenimiento
UNION ALL
SELECT 'Actividades', COUNT(*) FROM actividades_mantenimiento
UNION ALL
SELECT 'Mantenimientos', COUNT(*) FROM mantenimientos;

