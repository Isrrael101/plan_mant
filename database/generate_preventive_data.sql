-- ============================================
-- GENERAR DATOS PARA PREVENTIVOS VACÍOS
-- Actividades y Mantenimientos Preventivos
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- ============================================
-- PASO 1: Generar actividades para planes preventivos sin actividades
-- ============================================

-- Actividades estándar para mantenimiento preventivo por horas
-- Estas actividades se aplicarán a todos los planes preventivos que no tengan actividades

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    1 as numero_orden,
    'Sistema de Lubricación' as descripcion_componente,
    'Verificar nivel de aceite del motor y rellenar si es necesario' as actividad,
    5 as tiempo_min,
    10 as tiempo_promedio,
    15 as tiempo_max,
    25.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL)
LIMIT 250;

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    2 as numero_orden,
    'Filtros' as descripcion_componente,
    'Revisar estado de filtros de aire, aceite y combustible' as actividad,
    10 as tiempo_min,
    15 as tiempo_promedio,
    20 as tiempo_max,
    35.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    3 as numero_orden,
    'Sistema de Refrigeración' as descripcion_componente,
    'Verificar nivel de refrigerante y estado de mangueras' as actividad,
    8 as tiempo_min,
    12 as tiempo_promedio,
    18 as tiempo_max,
    30.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    4 as numero_orden,
    'Sistema Hidráulico' as descripcion_componente,
    'Revisar nivel de aceite hidráulico y buscar fugas' as actividad,
    10 as tiempo_min,
    15 as tiempo_promedio,
    25 as tiempo_max,
    40.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    5 as numero_orden,
    'Neumáticos' as descripcion_componente,
    'Verificar presión y estado general de neumáticos' as actividad,
    5 as tiempo_min,
    8 as tiempo_promedio,
    12 as tiempo_max,
    20.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

-- Para planes de 250 horas o más, agregar actividades adicionales
INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    6 as numero_orden,
    'Cambio de Aceite Motor' as descripcion_componente,
    'Cambiar aceite del motor y filtro de aceite' as actividad,
    30 as tiempo_min,
    45 as tiempo_promedio,
    60 as tiempo_max,
    150.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion >= 250
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    7 as numero_orden,
    'Sistema Eléctrico' as descripcion_componente,
    'Revisar batería, conexiones y sistema de carga' as actividad,
    15 as tiempo_min,
    20 as tiempo_promedio,
    30 as tiempo_max,
    50.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion >= 250
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

-- Para planes de 500 horas o más, agregar más actividades
INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    8 as numero_orden,
    'Cambio de Filtros' as descripcion_componente,
    'Cambiar filtros de aire, combustible y aceite' as actividad,
    20 as tiempo_min,
    30 as tiempo_promedio,
    40 as tiempo_max,
    120.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion >= 500
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    9 as numero_orden,
    'Sistema de Transmisión' as descripcion_componente,
    'Revisar nivel de aceite de transmisión y estado general' as actividad,
    15 as tiempo_min,
    20 as tiempo_promedio,
    30 as tiempo_max,
    60.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion >= 500
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

-- Para planes de 1000 horas o más, agregar actividades más complejas
INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    10 as numero_orden,
    'Inspección General' as descripcion_componente,
    'Inspección completa de estructura, soldaduras y componentes críticos' as actividad,
    45 as tiempo_min,
    60 as tiempo_promedio,
    90 as tiempo_max,
    200.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion >= 1000
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    11 as numero_orden,
    'Sistema de Frenos' as descripcion_componente,
    'Revisar pastillas, discos y nivel de líquido de frenos' as actividad,
    20 as tiempo_min,
    30 as tiempo_promedio,
    45 as tiempo_max,
    100.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion >= 1000
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

-- Para planes de 2000 horas, agregar actividades mayores
INSERT INTO actividades_mantenimiento (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado)
SELECT 
    pm.id as plan_id,
    12 as numero_orden,
    'Mantenimiento Mayor' as descripcion_componente,
    'Mantenimiento mayor: revisión completa de motor, transmisión y sistemas hidráulicos' as actividad,
    120 as tiempo_min,
    180 as tiempo_promedio,
    240 as tiempo_max,
    500.00 as costo_estimado
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.horas_operacion >= 2000
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM actividades_mantenimiento WHERE plan_id IS NOT NULL);

-- ============================================
-- PASO 2: Generar mantenimientos preventivos ejecutados
-- ============================================

-- Obtener personal técnico para asignar a mantenimientos
SET @mecanico_id = (SELECT id FROM personal WHERE cargo LIKE '%Mecánico%' LIMIT 1);
SET @supervisor_id = (SELECT id FROM personal WHERE cargo LIKE '%Supervisor%' OR cargo LIKE '%Jefe%' LIMIT 1);

-- Si no hay personal, usar el primero disponible
SET @mecanico_id = IFNULL(@mecanico_id, (SELECT id FROM personal LIMIT 1));
SET @supervisor_id = IFNULL(@supervisor_id, @mecanico_id);

-- Generar mantenimientos preventivos para cada plan (últimos 6 meses)
INSERT INTO mantenimientos (maquinaria_id, plan_id, tipo_mantenimiento, fecha_programada, fecha_ejecucion, horas_maquina, estado, observaciones, costo_mano_obra, costo_insumos)
SELECT 
    pm.maquinaria_id,
    pm.id as plan_id,
    'PREVENTIVO' as tipo_mantenimiento,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 180) DAY) as fecha_programada,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 150) DAY) as fecha_ejecucion,
    pm.horas_operacion + (RAND() * 50) as horas_maquina,
    CASE 
        WHEN RAND() > 0.7 THEN 'COMPLETADO'
        WHEN RAND() > 0.3 THEN 'EN_PROCESO'
        ELSE 'PROGRAMADO'
    END as estado,
    CASE 
        WHEN RAND() > 0.5 THEN CONCAT('Mantenimiento preventivo de ', pm.horas_operacion, ' horas ejecutado correctamente. Equipo en buen estado.')
        ELSE CONCAT('Mantenimiento preventivo de ', pm.horas_operacion, ' horas. Se realizaron ajustes menores.')
    END as observaciones,
    (SELECT SUM(tiempo_promedio) FROM actividades_mantenimiento WHERE plan_id = pm.id) * 0.5 as costo_mano_obra,
    (SELECT SUM(costo_estimado) FROM actividades_mantenimiento WHERE plan_id = pm.id) * 0.6 as costo_insumos
FROM planes_mantenimiento pm
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
AND pm.activo = TRUE
AND pm.id NOT IN (SELECT DISTINCT plan_id FROM mantenimientos WHERE plan_id IS NOT NULL AND tipo_mantenimiento = 'PREVENTIVO');

-- ============================================
-- PASO 3: Asignar personal a mantenimientos
-- ============================================

INSERT INTO mantenimiento_personal (mantenimiento_id, personal_id, horas_trabajadas, tarifa_aplicada)
SELECT 
    m.id as mantenimiento_id,
    p.id as personal_id,
    (SELECT AVG(tiempo_promedio) FROM actividades_mantenimiento WHERE plan_id = m.plan_id) / 60.0 as horas_trabajadas,
    COALESCE(p.tarifa_hora, 25.00) as tarifa_aplicada
FROM mantenimientos m
CROSS JOIN (
    SELECT id, tarifa_hora FROM personal 
    WHERE cargo LIKE '%Mecánico%' OR cargo LIKE '%Técnico%' OR cargo LIKE '%Electricista%'
    ORDER BY RAND()
    LIMIT 1
) p
WHERE m.tipo_mantenimiento = 'PREVENTIVO'
AND m.id NOT IN (SELECT DISTINCT mantenimiento_id FROM mantenimiento_personal);

-- ============================================
-- PASO 4: Asignar insumos a mantenimientos
-- ============================================

INSERT INTO mantenimiento_insumos (mantenimiento_id, insumo_id, cantidad_usada, unidad, precio_unitario)
SELECT 
    m.id as mantenimiento_id,
    i.id as insumo_id,
    CASE 
        WHEN i.nombre LIKE '%Aceite%' THEN 5.0 + (RAND() * 10)
        WHEN i.nombre LIKE '%Filtro%' THEN 1.0 + (RAND() * 2)
        WHEN i.nombre LIKE '%Refrigerante%' THEN 2.0 + (RAND() * 5)
        ELSE 1.0 + (RAND() * 3)
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
AND m.id NOT IN (SELECT DISTINCT mantenimiento_id FROM mantenimiento_insumos);

-- ============================================
-- PASO 5: Registrar actividades ejecutadas
-- ============================================

INSERT INTO mantenimiento_actividades (mantenimiento_id, actividad_id, descripcion, tiempo_real, completada, observaciones)
SELECT 
    m.id as mantenimiento_id,
    am.id as actividad_id,
    am.actividad as descripcion,
    am.tiempo_promedio + (RAND() * (am.tiempo_max - am.tiempo_promedio)) as tiempo_real,
    CASE WHEN m.estado = 'COMPLETADO' THEN TRUE ELSE FALSE END as completada,
    CASE 
        WHEN m.estado = 'COMPLETADO' THEN 'Actividad completada según plan de mantenimiento'
        ELSE 'Actividad en proceso'
    END as observaciones
FROM mantenimientos m
INNER JOIN actividades_mantenimiento am ON m.plan_id = am.plan_id
WHERE m.tipo_mantenimiento = 'PREVENTIVO'
AND m.id NOT IN (SELECT DISTINCT mantenimiento_id FROM mantenimiento_actividades);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT 'Datos generados exitosamente' AS resultado;

SELECT 'Resumen de actividades generadas:' AS info;
SELECT 
    pm.horas_operacion,
    COUNT(DISTINCT pm.id) as planes_con_actividades,
    COUNT(am.id) as total_actividades
FROM planes_mantenimiento pm
LEFT JOIN actividades_mantenimiento am ON pm.id = am.plan_id
WHERE pm.tipo_mantenimiento = 'PREVENTIVO'
GROUP BY pm.horas_operacion
ORDER BY pm.horas_operacion;

SELECT 'Resumen de mantenimientos generados:' AS info;
SELECT 
    estado,
    COUNT(*) as total
FROM mantenimientos
WHERE tipo_mantenimiento = 'PREVENTIVO'
GROUP BY estado;

