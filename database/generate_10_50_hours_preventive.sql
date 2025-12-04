-- ============================================
-- GENERAR DATOS PARA PREVENTIVOS DE 10 Y 50 HORAS
-- Actividades y Mantenimientos Preventivos
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- ============================================
-- PASO 1: Generar actividades para planes de 10 horas
-- ============================================

-- Actividades básicas para mantenimiento preventivo de 10 horas
INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    1 as numero_orden,
    'Inspección Visual General' as descripcion_componente,
    'Realizar inspección visual completa del equipo, verificar estado general' as actividad,
    10 as tiempo_min,
    15 as tiempo_promedio,
    20 as tiempo_max,
    30.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 10
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    2 as numero_orden,
    'Sistema de Lubricación' as descripcion_componente,
    'Verificar nivel de aceite del motor, rellenar si es necesario' as actividad,
    5 as tiempo_min,
    8 as tiempo_promedio,
    12 as tiempo_max,
    20.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 10
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    3 as numero_orden,
    'Sistema de Refrigeración' as descripcion_componente,
    'Verificar nivel de refrigerante y estado visual de mangueras' as actividad,
    5 as tiempo_min,
    8 as tiempo_promedio,
    12 as tiempo_max,
    18.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 10
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    4 as numero_orden,
    'Neumáticos' as descripcion_componente,
    'Verificar presión de neumáticos y estado general' as actividad,
    5 as tiempo_min,
    8 as tiempo_promedio,
    10 as tiempo_max,
    15.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 10
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    5 as numero_orden,
    'Sistema Eléctrico Básico' as descripcion_componente,
    'Verificar funcionamiento de luces y sistema de arranque' as actividad,
    5 as tiempo_min,
    8 as tiempo_promedio,
    12 as tiempo_max,
    22.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 10
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

-- ============================================
-- PASO 2: Generar actividades para planes de 50 horas
-- ============================================

-- Actividades para mantenimiento preventivo de 50 horas (incluye las de 10h + adicionales)
INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    1 as numero_orden,
    'Inspección Visual General' as descripcion_componente,
    'Realizar inspección visual completa del equipo, verificar estado general' as actividad,
    10 as tiempo_min,
    15 as tiempo_promedio,
    20 as tiempo_max,
    30.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    2 as numero_orden,
    'Sistema de Lubricación' as descripcion_componente,
    'Verificar nivel de aceite del motor, rellenar si es necesario' as actividad,
    5 as tiempo_min,
    8 as tiempo_promedio,
    12 as tiempo_max,
    20.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    3 as numero_orden,
    'Filtros' as descripcion_componente,
    'Revisar estado de filtros de aire, aceite y combustible' as actividad,
    8 as tiempo_min,
    12 as tiempo_promedio,
    18 as tiempo_max,
    35.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    4 as numero_orden,
    'Sistema de Refrigeración' as descripcion_componente,
    'Verificar nivel de refrigerante y estado de mangueras' as actividad,
    8 as tiempo_min,
    12 as tiempo_promedio,
    18 as tiempo_max,
    30.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    5 as numero_orden,
    'Sistema Hidráulico' as descripcion_componente,
    'Revisar nivel de aceite hidráulico y buscar fugas visibles' as actividad,
    10 as tiempo_min,
    15 as tiempo_promedio,
    20 as tiempo_max,
    40.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    6 as numero_orden,
    'Neumáticos' as descripcion_componente,
    'Verificar presión y estado general de neumáticos' as actividad,
    5 as tiempo_min,
    8 as tiempo_promedio,
    12 as tiempo_max,
    20.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    7 as numero_orden,
    'Sistema Eléctrico' as descripcion_componente,
    'Revisar batería, conexiones y sistema de carga' as actividad,
    10 as tiempo_min,
    15 as tiempo_promedio,
    20 as tiempo_max,
    35.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    8 as numero_orden,
    'Limpieza General' as descripcion_componente,
    'Limpieza general del equipo, remover suciedad y residuos' as actividad,
    15 as tiempo_min,
    20 as tiempo_promedio,
    30 as tiempo_max,
    25.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

-- ============================================
-- PASO 3: Generar mantenimientos para planes de 10 horas
-- ============================================

INSERT INTO mantenimientos (maquinaria_id, plan_id, tipo_mantenimiento, fecha_programada, fecha_ejecucion, horas_maquina, estado, observaciones, costo_mano_obra, costo_insumos)
SELECT 
    pm.maquinaria_id,
    pm.id as plan_id,
    'PREVENTIVO' as tipo_mantenimiento,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 90) DAY) as fecha_programada,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 75) DAY) as fecha_ejecucion,
    pm.horas_operacion + (RAND() * 20) as horas_maquina,
    CASE 
        WHEN RAND() > 0.6 THEN 'COMPLETADO'
        WHEN RAND() > 0.2 THEN 'EN_PROCESO'
        ELSE 'PROGRAMADO'
    END as estado,
    CASE 
        WHEN RAND() > 0.5 THEN CONCAT('Mantenimiento preventivo de ', pm.horas_operacion, ' horas ejecutado correctamente. Equipo en buen estado operativo.')
        ELSE CONCAT('Mantenimiento preventivo de ', pm.horas_operacion, ' horas. Inspección visual completada sin observaciones.')
    END as observaciones,
    (SELECT COALESCE(SUM(tiempo_promedio), 50) FROM actividades_mantenimiento WHERE plan_id = pm.id) * 0.4 as costo_mano_obra,
    (SELECT COALESCE(SUM(costo_estimado), 100) FROM actividades_mantenimiento WHERE plan_id = pm.id) * 0.3 as costo_insumos
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 10
AND pm.activo = TRUE
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM mantenimientos WHERE plan_id IS NOT NULL AND tipo_mantenimiento = 'PREVENTIVO');

-- ============================================
-- PASO 4: Generar mantenimientos para planes de 50 horas
-- ============================================

INSERT INTO mantenimientos (maquinaria_id, plan_id, tipo_mantenimiento, fecha_programada, fecha_ejecucion, horas_maquina, estado, observaciones, costo_mano_obra, costo_insumos)
SELECT 
    pm.maquinaria_id,
    pm.id as plan_id,
    'PREVENTIVO' as tipo_mantenimiento,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 120) DAY) as fecha_programada,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 100) DAY) as fecha_ejecucion,
    pm.horas_operacion + (RAND() * 30) as horas_maquina,
    CASE 
        WHEN RAND() > 0.65 THEN 'COMPLETADO'
        WHEN RAND() > 0.25 THEN 'EN_PROCESO'
        ELSE 'PROGRAMADO'
    END as estado,
    CASE 
        WHEN RAND() > 0.5 THEN CONCAT('Mantenimiento preventivo de ', pm.horas_operacion, ' horas ejecutado correctamente. Todos los sistemas revisados y en buen estado.')
        ELSE CONCAT('Mantenimiento preventivo de ', pm.horas_operacion, ' horas. Se realizaron ajustes menores en filtros y lubricación.')
    END as observaciones,
    (SELECT COALESCE(SUM(tiempo_promedio), 100) FROM actividades_mantenimiento WHERE plan_id = pm.id) * 0.45 as costo_mano_obra,
    (SELECT COALESCE(SUM(costo_estimado), 200) FROM actividades_mantenimiento WHERE plan_id = pm.id) * 0.4 as costo_insumos
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion = 50
AND pm.activo = TRUE
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM mantenimientos WHERE plan_id IS NOT NULL AND tipo_mantenimiento = 'PREVENTIVO');

-- ============================================
-- PASO 5: Asignar personal a mantenimientos de 10 y 50 horas
-- ============================================

INSERT INTO mantenimiento_personal (mantenimiento_id, personal_id, horas_trabajadas, tarifa_aplicada)
SELECT 
    m.id as mantenimiento_id,
    p.id as personal_id,
    (SELECT COALESCE(AVG(tiempo_promedio), 50) FROM actividades_mantenimiento WHERE plan_id = m.plan_id) / 60.0 as horas_trabajadas,
    COALESCE(p.tarifa_hora, 25.00) as tarifa_aplicada
FROM mantenimientos m
CROSS JOIN (
    SELECT id, tarifa_hora FROM personal 
    WHERE cargo LIKE '%Mecánico%' OR cargo LIKE '%Técnico%' OR cargo LIKE '%Electricista%'
    ORDER BY RAND()
    LIMIT 1
) p
WHERE m.tipo_mantenimiento = 'PREVENTIVO'
AND m.plan_id IN (SELECT id FROM planes_mantenimiento WHERE horas_operacion IN (10, 50))
AND m.id NOT IN (SELECT DISTINCT mantenimiento_id FROM mantenimiento_personal);

-- ============================================
-- PASO 6: Asignar insumos a mantenimientos de 10 y 50 horas
-- ============================================

INSERT INTO mantenimiento_insumos (mantenimiento_id, insumo_id, cantidad_usada, unidad, precio_unitario)
SELECT 
    m.id as mantenimiento_id,
    i.id as insumo_id,
    CASE 
        WHEN i.nombre LIKE '%Aceite%' THEN 2.0 + (RAND() * 3)
        WHEN i.nombre LIKE '%Filtro%' THEN 1.0
        WHEN i.nombre LIKE '%Refrigerante%' THEN 1.0 + (RAND() * 2)
        ELSE 1.0 + (RAND() * 2)
    END as cantidad_usada,
    COALESCE(i.unidad, 'L') as unidad,
    COALESCE(i.precio_unitario, 10.00) as precio_unitario
FROM mantenimientos m
CROSS JOIN (
    SELECT id, nombre, unidad, precio_unitario FROM insumos 
    WHERE nombre LIKE '%Aceite%' OR nombre LIKE '%Filtro%' OR nombre LIKE '%Refrigerante%' OR nombre LIKE '%Hidráulico%'
    ORDER BY RAND()
    LIMIT 1
) i
WHERE m.tipo_mantenimiento = 'PREVENTIVO'
AND m.plan_id IN (SELECT id FROM planes_mantenimiento WHERE horas_operacion IN (10, 50))
AND m.id NOT IN (SELECT DISTINCT mantenimiento_id FROM mantenimiento_insumos);

-- ============================================
-- PASO 7: Registrar actividades ejecutadas para 10 y 50 horas
-- ============================================

INSERT INTO mantenimiento_actividades (mantenimiento_id, actividad_id, descripcion, tiempo_real, completada, observaciones)
SELECT 
    m.id as mantenimiento_id,
    am.id as actividad_id,
    am.actividad as descripcion,
    am.tiempo_promedio + (RAND() * (am.tiempo_max - am.tiempo_promedio)) as tiempo_real,
    CASE WHEN m.estado = 'COMPLETADO' THEN TRUE ELSE FALSE END as completada,
    CASE 
        WHEN m.estado = 'COMPLETADO' THEN 'Actividad completada según plan de mantenimiento preventivo'
        ELSE 'Actividad en proceso'
    END as observaciones
FROM mantenimientos m
INNER JOIN actividades_mantenimiento am ON m.plan_id = am.plan_id
WHERE m.tipo_mantenimiento = 'PREVENTIVO'
AND m.plan_id IN (SELECT id FROM planes_mantenimiento WHERE horas_operacion IN (10, 50))
AND m.id NOT IN (SELECT DISTINCT mantenimiento_id FROM mantenimiento_actividades);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT 'Datos generados para preventivos de 10 y 50 horas' AS resultado;

SELECT 'Resumen por intervalo de horas:' AS info;
SELECT 
    pm.horas_operacion,
    COUNT(DISTINCT pm.id) as total_planes,
    COUNT(DISTINCT am.id) as total_actividades,
    COUNT(DISTINCT m.id) as total_mantenimientos
FROM planes_mantenimiento pm
LEFT JOIN actividades_mantenimiento am ON pm.id = am.plan_id
LEFT JOIN mantenimientos m ON pm.id = m.plan_id AND m.tipo_mantenimiento = 'PREVENTIVO'
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion IN (10, 50)
GROUP BY pm.horas_operacion
ORDER BY pm.horas_operacion;

SELECT 'Estado de mantenimientos de 10 y 50 horas:' AS info;
SELECT 
    estado,
    COUNT(*) as total
FROM mantenimientos
WHERE tipo_mantenimiento = 'PREVENTIVO'
AND plan_id IN (SELECT id FROM planes_mantenimiento WHERE horas_operacion IN (10, 50))
GROUP BY estado;

