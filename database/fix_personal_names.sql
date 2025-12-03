-- ============================================
-- Script para corregir errores ortográficos en nombres del personal
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

USE mtto_db;

-- ============================================
-- CORREGIR ERRORES ORTOGRÁFICOS EN APELLIDOS
-- ============================================
-- Corregir "Alvarez" a "Álvarez"
UPDATE personal SET nombre_completo = 'Fernando Álvarez Rojas' WHERE codigo = 'PER-030';

-- ============================================
-- CORREGIR NOMBRES ADMINISTRATIVOS CON PROBLEMAS DE UTF-8
-- ============================================
UPDATE personal SET nombre_completo = 'Lic. Sofía Torres' WHERE codigo = 'PER-041';
UPDATE personal SET nombre_completo = 'María Elena Vargas' WHERE codigo = 'PER-042';
UPDATE personal SET nombre_completo = 'Carlos Alberto Méndez' WHERE codigo = 'PER-043';
UPDATE personal SET nombre_completo = 'Ana Lucía Benítez' WHERE codigo = 'PER-044';
UPDATE personal SET nombre_completo = 'Roberto Daniel García' WHERE codigo = 'PER-045';
UPDATE personal SET nombre_completo = 'C.P. Miguel Ángel Herrera' WHERE codigo = 'PER-046';
UPDATE personal SET nombre_completo = 'Patricia Beatriz Ríos' WHERE codigo = 'PER-047';
UPDATE personal SET nombre_completo = 'Fernando José Martínez' WHERE codigo = 'PER-048';
UPDATE personal SET nombre_completo = 'Lucía Isabel Fernández' WHERE codigo = 'PER-049';
UPDATE personal SET nombre_completo = 'Juan Carlos Ramírez' WHERE codigo = 'PER-050';
UPDATE personal SET nombre_completo = 'Carmen Elena Ruiz' WHERE codigo = 'PER-051';
UPDATE personal SET nombre_completo = 'Lic. Carmen Ruiz' WHERE codigo = 'PER-052';
UPDATE personal SET nombre_completo = 'Diego Armando López' WHERE codigo = 'PER-053';
UPDATE personal SET nombre_completo = 'Valeria Alejandra Sánchez' WHERE codigo = 'PER-054';
UPDATE personal SET nombre_completo = 'Andrea Paola Jiménez' WHERE codigo = 'PER-055';

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================
SELECT 'Nombres del personal corregidos exitosamente' AS resultado;

