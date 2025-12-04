-- ============================================
-- REORGANIZACIÓN DE PERSONAL
-- Eliminar duplicados y mover a niveles operativos
-- Asignar cargos profesionales por departamento
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- ============================================
-- PASO 1: Identificar y eliminar duplicados en niveles gerenciales/supervisión
-- Mantener solo uno de cada cargo gerencial/supervisión
-- ============================================

-- Mantener solo un Gerente de Operaciones Mineras
UPDATE personal SET cargo = 'Operador de Equipos Mineros' 
WHERE cargo = 'Gerente de Operaciones Mineras' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Gerente de Operaciones Mineras' LIMIT 1) AS temp)
LIMIT 1;

-- Mantener solo un Gerente de Mantenimiento
UPDATE personal SET cargo = 'Mecánico de Equipos Pesados' 
WHERE cargo = 'Gerente de Mantenimiento' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Gerente de Mantenimiento' LIMIT 1) AS temp)
LIMIT 1;

-- Mantener solo un Gerente de Seguridad
UPDATE personal SET cargo = 'Inspector de Seguridad Minera' 
WHERE cargo = 'Gerente de Seguridad y Salud Ocupacional' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Gerente de Seguridad y Salud Ocupacional' LIMIT 1) AS temp)
LIMIT 1;

-- Mantener solo un Gerente Administrativo
UPDATE personal SET cargo = 'Administrativo' 
WHERE cargo = 'Gerente Administrativo y Financiero' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Gerente Administrativo y Financiero' LIMIT 1) AS temp)
LIMIT 1;

-- Mantener solo un Gerente de RRHH
UPDATE personal SET cargo = 'Especialista en Recursos Humanos' 
WHERE cargo = 'Gerente de Recursos Humanos' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Gerente de Recursos Humanos' LIMIT 1) AS temp)
LIMIT 1;

-- ============================================
-- PASO 2: Reorganizar Superintendencias duplicadas
-- ============================================

-- Superintendentes de Mina adicionales -> Operadores
UPDATE personal SET cargo = 'Operador de Equipos Mineros' 
WHERE cargo = 'Superintendente de Mina' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Superintendente de Mina' LIMIT 1) AS temp)
LIMIT 3;

-- Superintendentes de Planta adicionales -> Operadores de Planta
UPDATE personal SET cargo = 'Operador de Planta de Procesamiento' 
WHERE cargo = 'Superintendente de Planta' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Superintendente de Planta' LIMIT 1) AS temp)
LIMIT 3;

-- Superintendentes de Mantenimiento adicionales -> Mecánicos
UPDATE personal SET cargo = 'Mecánico de Equipos Pesados' 
WHERE cargo = 'Superintendente de Mantenimiento' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Superintendente de Mantenimiento' LIMIT 1) AS temp)
LIMIT 3;

-- Superintendentes de Seguridad adicionales -> Inspectores
UPDATE personal SET cargo = 'Inspector de Seguridad Minera' 
WHERE cargo = 'Superintendente de Seguridad y Salud Ocupacional' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Superintendente de Seguridad y Salud Ocupacional' LIMIT 1) AS temp)
LIMIT 3;

-- ============================================
-- PASO 3: Reorganizar Jefaturas duplicadas
-- ============================================

-- Jefes de Mina adicionales -> Supervisores de Producción
UPDATE personal SET cargo = 'Supervisor de Producción Minera' 
WHERE cargo IN ('Jefe de Mina', 'Jefe de Operaciones de Mina') 
AND codigo NOT IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo IN ('Jefe de Mina', 'Jefe de Operaciones de Mina') 
        ORDER BY codigo LIMIT 2
    ) AS temp
)
LIMIT 5;

-- Jefes de Planta adicionales -> Supervisores de Planta
UPDATE personal SET cargo = 'Supervisor de Operaciones de Planta' 
WHERE cargo IN ('Jefe de Planta de Procesamiento', 'Jefe de Operaciones de Planta') 
AND codigo NOT IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo IN ('Jefe de Planta de Procesamiento', 'Jefe de Operaciones de Planta') 
        ORDER BY codigo LIMIT 2
    ) AS temp
)
LIMIT 5;

-- Jefes de Mantenimiento Mecánico adicionales -> Técnicos Especializados
UPDATE personal SET cargo = 'Técnico en Hidráulica Industrial' 
WHERE cargo = 'Jefe de Mantenimiento Mecánico' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe de Mantenimiento Mecánico' LIMIT 1) AS temp)
LIMIT 3;

UPDATE personal SET cargo = 'Técnico en Motores Diesel' 
WHERE cargo = 'Jefe de Taller Mecánico' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe de Taller Mecánico' LIMIT 1) AS temp)
LIMIT 2;

-- Jefes de Mantenimiento Eléctrico adicionales -> Electricistas
UPDATE personal SET cargo = 'Electricista Industrial' 
WHERE cargo = 'Jefe de Mantenimiento Eléctrico' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe de Mantenimiento Eléctrico' LIMIT 1) AS temp)
LIMIT 2;

UPDATE personal SET cargo = 'Electricista Industrial' 
WHERE cargo = 'Jefe de Taller Eléctrico' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe de Taller Eléctrico' LIMIT 1) AS temp)
LIMIT 2;

-- Jefes de Planificación adicionales -> Planificadores
UPDATE personal SET cargo = 'Planificador de Mantenimiento' 
WHERE cargo = 'Jefe de Planificación de Mantenimiento' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe de Planificación de Mantenimiento' LIMIT 1) AS temp)
LIMIT 2;

-- Jefes de Seguridad adicionales -> Supervisores de Seguridad
UPDATE personal SET cargo = 'Supervisor de Seguridad' 
WHERE cargo = 'Jefe de Seguridad Minera' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe de Seguridad Minera' LIMIT 1) AS temp)
LIMIT 2;

-- Jefes Administrativos adicionales -> Administrativos
UPDATE personal SET cargo = 'Administrativo' 
WHERE cargo = 'Jefe Administrativo' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe Administrativo' LIMIT 1) AS temp)
LIMIT 2;

-- Jefes de Contabilidad adicionales -> Contadores
UPDATE personal SET cargo = 'Contador' 
WHERE cargo = 'Jefe de Contabilidad' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe de Contabilidad' LIMIT 1) AS temp)
LIMIT 2;

-- Jefes de RRHH adicionales -> Especialistas
UPDATE personal SET cargo = 'Especialista en Recursos Humanos' 
WHERE cargo = 'Jefe de Recursos Humanos' 
AND codigo NOT IN (SELECT codigo FROM (SELECT codigo FROM personal WHERE cargo = 'Jefe de Recursos Humanos' LIMIT 1) AS temp)
LIMIT 2;

-- ============================================
-- PASO 4: Reorganizar Supervisores duplicados
-- ============================================

-- Supervisores de Producción adicionales -> Operadores
UPDATE personal SET cargo = 'Operador de Equipos Mineros' 
WHERE cargo = 'Supervisor de Producción Minera' 
AND codigo NOT IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo = 'Supervisor de Producción Minera' 
        ORDER BY codigo LIMIT 3
    ) AS temp
)
LIMIT 10;

-- Supervisores de Planta adicionales -> Operadores de Planta
UPDATE personal SET cargo = 'Operador de Planta de Procesamiento' 
WHERE cargo = 'Supervisor de Operaciones de Planta' 
AND codigo NOT IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo = 'Supervisor de Operaciones de Planta' 
        ORDER BY codigo LIMIT 3
    ) AS temp
)
LIMIT 10;

-- Supervisores de Mantenimiento Mecánico adicionales -> Mecánicos
UPDATE personal SET cargo = 'Mecánico de Equipos Pesados' 
WHERE cargo = 'Supervisor de Mantenimiento Mecánico' 
AND codigo NOT IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo = 'Supervisor de Mantenimiento Mecánico' 
        ORDER BY codigo LIMIT 2
    ) AS temp
)
LIMIT 10;

-- Supervisores de Mantenimiento Eléctrico adicionales -> Electricistas
UPDATE personal SET cargo = 'Electricista Industrial' 
WHERE cargo = 'Supervisor de Mantenimiento Eléctrico' 
AND codigo NOT IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo = 'Supervisor de Mantenimiento Eléctrico' 
        ORDER BY codigo LIMIT 2
    ) AS temp
)
LIMIT 10;

-- Supervisores de Seguridad adicionales -> Inspectores
UPDATE personal SET cargo = 'Inspector de Seguridad Minera' 
WHERE cargo = 'Supervisor de Seguridad' 
AND codigo NOT IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo = 'Supervisor de Seguridad' 
        ORDER BY codigo LIMIT 2
    ) AS temp
)
LIMIT 10;

-- Planificadores adicionales -> Técnicos
UPDATE personal SET cargo = 'Técnico en Hidráulica Industrial' 
WHERE cargo = 'Planificador de Mantenimiento' 
AND codigo NOT IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo = 'Planificador de Mantenimiento' 
        ORDER BY codigo LIMIT 1
    ) AS temp
)
LIMIT 5;

-- ============================================
-- PASO 5: Distribuir personal operativo por departamentos
-- Asegurar distribución equilibrada
-- ============================================

-- Asegurar suficientes Operadores de Equipos Mineros (Mina)
UPDATE personal SET cargo = 'Operador de Equipos Mineros' 
WHERE cargo IN ('Ayudante de Operaciones Mineras', 'Operador de Planta de Procesamiento')
AND codigo IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo IN ('Ayudante de Operaciones Mineras', 'Operador de Planta de Procesamiento')
        ORDER BY RAND()
        LIMIT 30
    ) AS temp
)
LIMIT 30;

-- Asegurar suficientes Operadores de Planta
UPDATE personal SET cargo = 'Operador de Planta de Procesamiento' 
WHERE cargo IN ('Ayudante de Planta de Procesamiento', 'Operador de Equipos Mineros')
AND codigo IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo IN ('Ayudante de Planta de Procesamiento', 'Operador de Equipos Mineros')
        ORDER BY RAND()
        LIMIT 25
    ) AS temp
)
LIMIT 25;

-- Asegurar suficientes Mecánicos
UPDATE personal SET cargo = 'Mecánico de Equipos Pesados' 
WHERE cargo IN ('Técnico en Hidráulica Industrial', 'Técnico en Motores Diesel', 'Soldador Industrial')
AND codigo IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo IN ('Técnico en Hidráulica Industrial', 'Técnico en Motores Diesel', 'Soldador Industrial')
        ORDER BY RAND()
        LIMIT 20
    ) AS temp
)
LIMIT 20;

-- Asegurar suficientes Electricistas
UPDATE personal SET cargo = 'Electricista Industrial' 
WHERE cargo = 'Técnico Eléctrico'
LIMIT 10;

-- Asegurar suficientes Inspectores de Seguridad
UPDATE personal SET cargo = 'Inspector de Seguridad Minera' 
WHERE cargo IN ('Técnico en Seguridad Minera', 'Guardia de Seguridad Minera')
AND codigo IN (
    SELECT codigo FROM (
        SELECT codigo FROM personal 
        WHERE cargo IN ('Técnico en Seguridad Minera', 'Guardia de Seguridad Minera')
        ORDER BY RAND()
        LIMIT 15
    ) AS temp
)
LIMIT 15;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT 'Reorganización completada' AS resultado;

SELECT 'Distribución por nivel:' AS info;
SELECT CASE 
    WHEN cargo LIKE '%Gerente%' OR cargo LIKE '%Superintendente%' THEN 'Nivel Gerencial'
    WHEN cargo LIKE '%Jefe%' OR cargo LIKE '%Supervisor%' OR cargo LIKE '%Planificador%' THEN 'Nivel Supervisión'
    ELSE 'Nivel Operativo'
END as nivel, 
COUNT(*) as total 
FROM personal 
GROUP BY nivel 
ORDER BY CASE nivel 
    WHEN 'Nivel Gerencial' THEN 1 
    WHEN 'Nivel Supervisión' THEN 2 
    ELSE 3 
END;

SELECT 'Top 15 cargos más comunes:' AS info;
SELECT cargo, COUNT(*) as total 
FROM personal 
GROUP BY cargo 
ORDER BY total DESC 
LIMIT 15;

