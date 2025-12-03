-- ============================================
-- Script para reorganizar jerarquía de mantenimiento
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- ============================================
-- REORGANIZAR JEFES DE TALLER
-- ============================================
-- Mantener 1 Jefe de Taller Mecánico
UPDATE personal SET cargo = 'Jefe de Taller Mecánico' WHERE codigo = 'PER-019';

-- Mantener 1 Jefe de Taller Eléctrico
UPDATE personal SET cargo = 'Jefe de Taller Eléctrico' WHERE codigo = 'PER-020';

-- Cambiar el tercer Jefe de Taller a nivel inferior
UPDATE personal SET cargo = 'Mecánico Senior' WHERE codigo = 'PER-034';

-- ============================================
-- REORGANIZAR SUPERVISORES DE MANTENIMIENTO
-- ============================================
-- Mantener 1 Supervisor de Mantenimiento
-- PER-008 Fernando Díaz Pérez se mantiene como Supervisor de Mantenimiento

-- Cambiar los otros 3 Supervisores a niveles inferiores
UPDATE personal SET cargo = 'Técnico en Motores' WHERE codigo = 'PER-013';
UPDATE personal SET cargo = 'Mecánico Senior' WHERE codigo = 'PER-033';
UPDATE personal SET cargo = 'Electricista' WHERE codigo = 'PER-036';

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================
SELECT 'Reorganización jerárquica completada' AS resultado;

