-- ============================================
-- Migración: Agregar insumos y herramientas a actividades de mantenimiento
-- Con costos de uso y consumo
-- ============================================

USE mtto_db;

-- Limpiar datos anteriores si existen
DELETE FROM actividad_insumos;
DELETE FROM actividad_herramientas;

-- ============================================
-- Asignar INSUMOS a actividades de mantenimiento
-- ============================================

-- Insertar insumos para cada actividad basándose en el tipo de actividad
-- Usamos subconsultas para obtener IDs aleatorios de insumos existentes

-- Para actividades que contienen 'aceite' o 'lubric'
INSERT INTO actividad_insumos (actividad_id, insumo_id, cantidad, unidad, especificaciones, costo_unitario)
SELECT 
    am.id as actividad_id,
    i.id as insumo_id,
    ROUND(1 + RAND() * 10, 2) as cantidad,
    i.unidad,
    CONCAT('Especificación para ', am.descripcion_componente) as especificaciones,
    i.precio_unitario as costo_unitario
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id, unidad, precio_unitario 
    FROM insumos 
    WHERE nombre LIKE '%aceite%' OR nombre LIKE '%lubric%' OR nombre LIKE '%grasa%'
    ORDER BY RAND() 
    LIMIT 5
) i
WHERE am.actividad LIKE '%lubric%' 
   OR am.actividad LIKE '%aceite%' 
   OR am.actividad LIKE '%engrasar%'
   OR am.descripcion_componente LIKE '%motor%'
   OR am.descripcion_componente LIKE '%transmisión%'
LIMIT 500;

-- Para actividades de filtros
INSERT INTO actividad_insumos (actividad_id, insumo_id, cantidad, unidad, especificaciones, costo_unitario)
SELECT 
    am.id as actividad_id,
    i.id as insumo_id,
    ROUND(1 + RAND() * 3, 0) as cantidad,
    'unidad',
    CONCAT('Filtro para ', am.descripcion_componente) as especificaciones,
    i.precio_unitario as costo_unitario
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id, precio_unitario 
    FROM insumos 
    WHERE nombre LIKE '%filtro%'
    ORDER BY RAND() 
    LIMIT 5
) i
WHERE am.actividad LIKE '%filtro%' 
   OR am.actividad LIKE '%cambiar%filtro%'
   OR am.descripcion_componente LIKE '%filtro%'
LIMIT 300;

-- Para actividades de limpieza
INSERT INTO actividad_insumos (actividad_id, insumo_id, cantidad, unidad, especificaciones, costo_unitario)
SELECT 
    am.id as actividad_id,
    i.id as insumo_id,
    ROUND(0.5 + RAND() * 2, 2) as cantidad,
    i.unidad,
    'Para limpieza de componentes' as especificaciones,
    i.precio_unitario as costo_unitario
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id, unidad, precio_unitario 
    FROM insumos 
    WHERE nombre LIKE '%limpia%' OR nombre LIKE '%solvente%' OR nombre LIKE '%desengras%'
    ORDER BY RAND() 
    LIMIT 3
) i
WHERE am.actividad LIKE '%limpiar%' 
   OR am.actividad LIKE '%limpieza%'
LIMIT 200;

-- Para actividades eléctricas
INSERT INTO actividad_insumos (actividad_id, insumo_id, cantidad, unidad, especificaciones, costo_unitario)
SELECT 
    am.id as actividad_id,
    i.id as insumo_id,
    ROUND(1 + RAND() * 5, 0) as cantidad,
    i.unidad,
    'Material eléctrico' as especificaciones,
    i.precio_unitario as costo_unitario
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id, unidad, precio_unitario 
    FROM insumos 
    WHERE nombre LIKE '%cable%' OR nombre LIKE '%fusi%' OR nombre LIKE '%conector%' OR nombre LIKE '%batería%'
    ORDER BY RAND() 
    LIMIT 5
) i
WHERE am.actividad LIKE '%eléctric%' 
   OR am.actividad LIKE '%batería%'
   OR am.actividad LIKE '%conexión%'
   OR am.descripcion_componente LIKE '%eléctric%'
LIMIT 200;

-- Para actividades de frenos
INSERT INTO actividad_insumos (actividad_id, insumo_id, cantidad, unidad, especificaciones, costo_unitario)
SELECT 
    am.id as actividad_id,
    i.id as insumo_id,
    ROUND(0.5 + RAND() * 2, 2) as cantidad,
    i.unidad,
    'Líquido/pastilla de frenos' as especificaciones,
    i.precio_unitario as costo_unitario
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id, unidad, precio_unitario 
    FROM insumos 
    WHERE nombre LIKE '%freno%' OR nombre LIKE '%pastilla%' OR nombre LIKE '%líquido%'
    ORDER BY RAND() 
    LIMIT 4
) i
WHERE am.actividad LIKE '%freno%' 
   OR am.descripcion_componente LIKE '%freno%'
LIMIT 200;

-- Asignación general: cada actividad debe tener al menos 1-3 insumos
INSERT INTO actividad_insumos (actividad_id, insumo_id, cantidad, unidad, especificaciones, costo_unitario)
SELECT 
    am.id as actividad_id,
    i.id as insumo_id,
    ROUND(1 + RAND() * 5, 2) as cantidad,
    i.unidad,
    CONCAT('Insumo general para: ', LEFT(am.actividad, 50)) as especificaciones,
    i.precio_unitario as costo_unitario
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id, unidad, precio_unitario 
    FROM insumos 
    ORDER BY RAND() 
    LIMIT 3
) i
WHERE am.id NOT IN (SELECT DISTINCT actividad_id FROM actividad_insumos)
LIMIT 1000;

-- ============================================
-- Asignar HERRAMIENTAS a actividades de mantenimiento
-- ============================================

-- Para actividades mecánicas generales
INSERT INTO actividad_herramientas (actividad_id, herramienta_id, cantidad, especificaciones)
SELECT 
    am.id as actividad_id,
    h.id as herramienta_id,
    1 as cantidad,
    CONCAT('Herramienta requerida para: ', LEFT(am.actividad, 50)) as especificaciones
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id FROM herramientas 
    WHERE nombre LIKE '%llave%' OR nombre LIKE '%destornillador%' OR nombre LIKE '%dado%'
    ORDER BY RAND() 
    LIMIT 5
) h
WHERE am.actividad LIKE '%ajust%' 
   OR am.actividad LIKE '%apret%'
   OR am.actividad LIKE '%desmont%'
   OR am.actividad LIKE '%mont%'
LIMIT 500;

-- Para actividades de medición
INSERT INTO actividad_herramientas (actividad_id, herramienta_id, cantidad, especificaciones)
SELECT 
    am.id as actividad_id,
    h.id as herramienta_id,
    1 as cantidad,
    'Para medición y verificación' as especificaciones
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id FROM herramientas 
    WHERE nombre LIKE '%medidor%' OR nombre LIKE '%calibr%' OR nombre LIKE '%manómetro%' OR nombre LIKE '%multímetro%'
    ORDER BY RAND() 
    LIMIT 3
) h
WHERE am.actividad LIKE '%verific%' 
   OR am.actividad LIKE '%medir%'
   OR am.actividad LIKE '%revisar%'
   OR am.actividad LIKE '%comprobar%'
LIMIT 300;

-- Para actividades eléctricas
INSERT INTO actividad_herramientas (actividad_id, herramienta_id, cantidad, especificaciones)
SELECT 
    am.id as actividad_id,
    h.id as herramienta_id,
    1 as cantidad,
    'Herramienta eléctrica' as especificaciones
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id FROM herramientas 
    WHERE nombre LIKE '%multímetro%' OR nombre LIKE '%pinza%' OR nombre LIKE '%soldador%'
    ORDER BY RAND() 
    LIMIT 3
) h
WHERE am.actividad LIKE '%eléctric%' 
   OR am.actividad LIKE '%voltaje%'
   OR am.actividad LIKE '%conexión%'
   OR am.descripcion_componente LIKE '%eléctric%'
LIMIT 200;

-- Para actividades de lubricación
INSERT INTO actividad_herramientas (actividad_id, herramienta_id, cantidad, especificaciones)
SELECT 
    am.id as actividad_id,
    h.id as herramienta_id,
    1 as cantidad,
    'Para lubricación' as especificaciones
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id FROM herramientas 
    WHERE nombre LIKE '%engrasador%' OR nombre LIKE '%aceitera%' OR nombre LIKE '%bomba%'
    ORDER BY RAND() 
    LIMIT 2
) h
WHERE am.actividad LIKE '%lubric%' 
   OR am.actividad LIKE '%engrasar%'
   OR am.actividad LIKE '%aceite%'
LIMIT 200;

-- Para actividades de limpieza
INSERT INTO actividad_herramientas (actividad_id, herramienta_id, cantidad, especificaciones)
SELECT 
    am.id as actividad_id,
    h.id as herramienta_id,
    1 as cantidad,
    'Para limpieza' as especificaciones
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id FROM herramientas 
    WHERE nombre LIKE '%cepillo%' OR nombre LIKE '%trapo%' OR nombre LIKE '%pistola%aire%' OR nombre LIKE '%compresor%'
    ORDER BY RAND() 
    LIMIT 3
) h
WHERE am.actividad LIKE '%limpiar%' 
   OR am.actividad LIKE '%limpieza%'
LIMIT 200;

-- Asignación general: cada actividad debe tener al menos 1-2 herramientas
INSERT INTO actividad_herramientas (actividad_id, herramienta_id, cantidad, especificaciones)
SELECT 
    am.id as actividad_id,
    h.id as herramienta_id,
    1 as cantidad,
    CONCAT('Herramienta general para: ', LEFT(am.actividad, 50)) as especificaciones
FROM actividades_mantenimiento am
CROSS JOIN (
    SELECT id FROM herramientas 
    ORDER BY RAND() 
    LIMIT 2
) h
WHERE am.id NOT IN (SELECT DISTINCT actividad_id FROM actividad_herramientas)
LIMIT 800;

-- ============================================
-- Actualizar costos estimados en actividades
-- ============================================

-- Actualizar el costo_estimado de cada actividad sumando los insumos
UPDATE actividades_mantenimiento am
SET costo_estimado = (
    SELECT COALESCE(SUM(ai.costo_total), 0)
    FROM actividad_insumos ai
    WHERE ai.actividad_id = am.id
) + ROUND(50 + RAND() * 200, 2);  -- Agregar costo base de mano de obra estimada

-- ============================================
-- Verificación de datos insertados
-- ============================================

SELECT 'Resumen de datos generados:' as mensaje;

SELECT 
    'Actividades con insumos' as tipo,
    COUNT(DISTINCT actividad_id) as total_actividades,
    COUNT(*) as total_registros,
    ROUND(SUM(costo_total), 2) as costo_total_insumos
FROM actividad_insumos;

SELECT 
    'Actividades con herramientas' as tipo,
    COUNT(DISTINCT actividad_id) as total_actividades,
    COUNT(*) as total_registros
FROM actividad_herramientas;

SELECT 
    'Costo promedio por plan' as tipo,
    pm.nombre_plan,
    COUNT(DISTINCT am.id) as actividades,
    ROUND(SUM(am.costo_estimado), 2) as costo_total,
    ROUND(AVG(am.costo_estimado), 2) as costo_promedio
FROM planes_mantenimiento pm
JOIN actividades_mantenimiento am ON pm.id = am.plan_id
GROUP BY pm.id, pm.nombre_plan
ORDER BY costo_total DESC
LIMIT 20;

