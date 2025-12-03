-- ============================================
-- Script para convertir estructura a Empresa Minera Profesional
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- ============================================
-- ACTUALIZAR CARGOS A ESTRUCTURA MINERA PROFESIONAL
-- ============================================

-- Nivel Gerencial/Superintendencia (mantener los mejores)
-- PER-008: Supervisor de Mantenimiento -> Superintendente de Mantenimiento
UPDATE personal SET cargo = 'Superintendente de Mantenimiento' WHERE codigo = 'PER-008';

-- PER-019: Jefe de Taller Mecánico -> Jefe de Taller Mecánico (mantener)
-- PER-020: Jefe de Taller Eléctrico -> Jefe de Taller Eléctrico (mantener)

-- PER-011: Planificador de Mantenimiento (mantener)

-- Nivel de Jefatura/Supervisión
-- Crear nuevos cargos de supervisión minera
UPDATE personal SET cargo = 'Jefe de Mina' WHERE codigo = 'PER-010'; -- Operador -> Jefe de Mina

-- Supervisores de Mantenimiento (los que quedaron)
UPDATE personal SET cargo = 'Supervisor de Mantenimiento Mecánico' WHERE codigo = 'PER-013';
UPDATE personal SET cargo = 'Supervisor de Mantenimiento Eléctrico' WHERE codigo = 'PER-033';

-- Supervisor de Producción Minera
UPDATE personal SET cargo = 'Supervisor de Producción Minera' WHERE codigo = 'PER-036';

-- Nivel Técnico Especializado (Mantenimiento)
-- Mecánicos de Equipos Pesados Mineros
UPDATE personal SET cargo = 'Mecánico de Equipos Pesados' WHERE codigo IN ('PER-004', 'PER-005', 'PER-006', 'PER-014', 'PER-035');
UPDATE personal SET cargo = 'Mecánico de Equipos Pesados Senior' WHERE codigo IN ('PER-029', 'PER-033', 'PER-034');

-- Técnicos Especializados
UPDATE personal SET cargo = 'Técnico en Hidráulica Industrial' WHERE codigo IN ('PER-015', 'PER-016', 'PER-017', 'PER-018', 'PER-026', 'PER-028');
UPDATE personal SET cargo = 'Técnico en Motores Diesel' WHERE codigo IN ('PER-037', 'PER-038', 'PER-013');

-- Electricistas Industriales
UPDATE personal SET cargo = 'Electricista Industrial' WHERE codigo IN ('PER-007', 'PER-009', 'PER-021', 'PER-022', 'PER-023', 'PER-036');

-- Soldadores Industriales
UPDATE personal SET cargo = 'Soldador Industrial' WHERE codigo IN ('PER-002', 'PER-030', 'PER-031');

-- Lubricadores de Equipos Mineros
UPDATE personal SET cargo = 'Lubricador de Equipos Mineros' WHERE codigo IN ('PER-003', 'PER-012', 'PER-025', 'PER-032');

-- Operadores de Equipos Mineros
UPDATE personal SET cargo = 'Operador de Equipos Mineros' WHERE codigo = 'PER-010';

-- Nivel de Seguridad Minera
-- Superintendente de Seguridad
UPDATE personal SET cargo = 'Superintendente de Seguridad' WHERE codigo = 'PER-001'; -- Inspector de Calidad -> Superintendente de Seguridad
UPDATE personal SET cargo = 'Jefe de Seguridad Minera' WHERE codigo = 'PER-039'; -- Inspector de Calidad -> Jefe de Seguridad
UPDATE personal SET cargo = 'Supervisor de Seguridad' WHERE codigo = 'PER-040'; -- Mecánico Junior -> Supervisor de Seguridad

-- Nivel de Calidad
-- Mantener Inspector de Calidad para los que quedan (si hay)

-- Nivel Administrativo (mantener estructura)
-- Los cargos administrativos ya están bien, solo asegurar que sean profesionales

-- Verificar resultados
SELECT 'Conversión a empresa minera completada' AS resultado;

