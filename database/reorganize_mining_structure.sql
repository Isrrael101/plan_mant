-- ============================================
-- REORGANIZACIÓN ESTRUCTURAL DE EMPRESA MINERA
-- Estructura realista: Planta, Mina, Administración
-- Jerarquía: Pocos directivos/gerenciales, muchos operativos
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- ============================================
-- NIVEL 1: GERENCIA GENERAL (1 persona)
-- ============================================
-- Ya existe, mantener

-- ============================================
-- NIVEL 2: GERENCIAS (5 personas)
-- ============================================
-- Actualizar cargos existentes a nivel gerencial
UPDATE personal SET cargo = 'Gerente de Operaciones Mineras' WHERE codigo = 'PER-001' LIMIT 1;
UPDATE personal SET cargo = 'Gerente de Mantenimiento' WHERE codigo = 'PER-002' LIMIT 1;
UPDATE personal SET cargo = 'Gerente de Seguridad y Salud Ocupacional' WHERE codigo = 'PER-003' LIMIT 1;
UPDATE personal SET cargo = 'Gerente Administrativo y Financiero' WHERE codigo = 'PER-004' LIMIT 1;
UPDATE personal SET cargo = 'Gerente de Recursos Humanos' WHERE codigo = 'PER-005' LIMIT 1;

-- ============================================
-- NIVEL 3: SUPERINTENDENCIAS (4 personas)
-- ============================================
-- Superintendencia de Mina
UPDATE personal SET cargo = 'Superintendente de Mina' WHERE codigo = 'PER-006' LIMIT 1;
-- Superintendencia de Planta
UPDATE personal SET cargo = 'Superintendente de Planta' WHERE codigo = 'PER-007' LIMIT 1;
-- Superintendencia de Mantenimiento
UPDATE personal SET cargo = 'Superintendente de Mantenimiento' WHERE codigo = 'PER-008' LIMIT 1;
-- Superintendencia de Seguridad
UPDATE personal SET cargo = 'Superintendente de Seguridad y Salud Ocupacional' WHERE codigo = 'PER-009' LIMIT 1;

-- ============================================
-- NIVEL 4: JEFATURAS (15 personas)
-- ============================================
-- Jefaturas de Mina
UPDATE personal SET cargo = 'Jefe de Mina' WHERE codigo = 'PER-010' LIMIT 1;
UPDATE personal SET cargo = 'Jefe de Operaciones de Mina' WHERE codigo = 'PER-011' LIMIT 1;

-- Jefaturas de Planta
UPDATE personal SET cargo = 'Jefe de Planta de Procesamiento' WHERE codigo = 'PER-012' LIMIT 1;
UPDATE personal SET cargo = 'Jefe de Operaciones de Planta' WHERE codigo = 'PER-013' LIMIT 1;

-- Jefaturas de Mantenimiento
UPDATE personal SET cargo = 'Jefe de Mantenimiento Mecánico' WHERE codigo = 'PER-019' LIMIT 1;
UPDATE personal SET cargo = 'Jefe de Mantenimiento Eléctrico' WHERE codigo = 'PER-020' LIMIT 1;
UPDATE personal SET cargo = 'Jefe de Taller Mecánico' WHERE codigo = 'PER-021' LIMIT 1;
UPDATE personal SET cargo = 'Jefe de Taller Eléctrico' WHERE codigo = 'PER-022' LIMIT 1;
UPDATE personal SET cargo = 'Jefe de Planificación de Mantenimiento' WHERE codigo = 'PER-023' LIMIT 1;

-- Jefaturas de Seguridad
UPDATE personal SET cargo = 'Jefe de Seguridad Minera' WHERE codigo = 'PER-025' LIMIT 1;

-- Jefaturas Administrativas
UPDATE personal SET cargo = 'Jefe de Contabilidad' WHERE codigo = 'PER-026' LIMIT 1;
UPDATE personal SET cargo = 'Jefe Administrativo' WHERE codigo = 'PER-027' LIMIT 1;
UPDATE personal SET cargo = 'Jefe de Recursos Humanos' WHERE codigo = 'PER-028' LIMIT 1;

-- ============================================
-- NIVEL 5: SUPERVISORES (30 personas)
-- ============================================
-- Supervisores de Mina (5)
UPDATE personal SET cargo = 'Supervisor de Producción Minera' WHERE codigo IN ('PER-134', 'PER-135', 'PER-136', 'PER-137', 'PER-138') LIMIT 5;

-- Supervisores de Planta (5)
UPDATE personal SET cargo = 'Supervisor de Operaciones de Planta' WHERE codigo IN ('PER-139', 'PER-140', 'PER-141', 'PER-142', 'PER-143') LIMIT 5;

-- Supervisores de Mantenimiento Mecánico (8)
UPDATE personal SET cargo = 'Supervisor de Mantenimiento Mecánico' WHERE codigo IN ('PER-439', 'PER-440', 'PER-441', 'PER-144', 'PER-145', 'PER-146', 'PER-147', 'PER-148') LIMIT 8;

-- Supervisores de Mantenimiento Eléctrico (5)
UPDATE personal SET cargo = 'Supervisor de Mantenimiento Eléctrico' WHERE codigo IN ('PER-442', 'PER-443', 'PER-444', 'PER-149', 'PER-150') LIMIT 5;

-- Supervisores de Seguridad (5)
UPDATE personal SET cargo = 'Supervisor de Seguridad' WHERE codigo IN ('PER-364', 'PER-365', 'PER-366', 'PER-367', 'PER-368') LIMIT 5;

-- Planificadores de Mantenimiento (2)
UPDATE personal SET cargo = 'Planificador de Mantenimiento' WHERE codigo IN ('PER-445', 'PER-446') LIMIT 2;

-- ============================================
-- NIVEL 6: OPERATIVOS (445 personas)
-- ============================================

-- OPERACIONES DE MINA (120 personas)
-- Operadores de Equipos Mineros (100)
UPDATE personal SET cargo = 'Operador de Equipos Mineros' 
WHERE codigo IN (
    'PER-094', 'PER-095', 'PER-096', 'PER-097', 'PER-098', 'PER-099', 'PER-100',
    'PER-101', 'PER-102', 'PER-103', 'PER-104', 'PER-105', 'PER-106', 'PER-107',
    'PER-108', 'PER-109', 'PER-110', 'PER-111', 'PER-112', 'PER-113', 'PER-114',
    'PER-115', 'PER-116', 'PER-117', 'PER-118', 'PER-119', 'PER-120', 'PER-121',
    'PER-122', 'PER-123', 'PER-124', 'PER-125', 'PER-126', 'PER-127', 'PER-128',
    'PER-129', 'PER-130', 'PER-131', 'PER-132', 'PER-133', 'PER-447', 'PER-448',
    'PER-449', 'PER-450', 'PER-451', 'PER-452', 'PER-453', 'PER-454', 'PER-455',
    'PER-456', 'PER-457', 'PER-458', 'PER-459', 'PER-460', 'PER-461', 'PER-462',
    'PER-463', 'PER-464', 'PER-465', 'PER-466', 'PER-467', 'PER-468', 'PER-469',
    'PER-470', 'PER-471', 'PER-472', 'PER-473', 'PER-474', 'PER-475', 'PER-476',
    'PER-477', 'PER-478', 'PER-479', 'PER-480', 'PER-481', 'PER-482', 'PER-483',
    'PER-484', 'PER-485', 'PER-486', 'PER-487', 'PER-488', 'PER-489', 'PER-490',
    'PER-491', 'PER-492', 'PER-493', 'PER-494', 'PER-495', 'PER-496', 'PER-497',
    'PER-498', 'PER-499', 'PER-500'
) LIMIT 100;

-- Ayudantes de Operaciones Mineras (20)
UPDATE personal SET cargo = 'Ayudante de Operaciones Mineras' 
WHERE codigo IN (
    'PER-014', 'PER-015', 'PER-016', 'PER-017', 'PER-018', 'PER-024', 'PER-029',
    'PER-030', 'PER-031', 'PER-032', 'PER-033', 'PER-034', 'PER-035', 'PER-036',
    'PER-037', 'PER-038', 'PER-039', 'PER-040', 'PER-041', 'PER-042'
) LIMIT 20;

-- OPERACIONES DE PLANTA (80 personas)
-- Operadores de Planta (60)
UPDATE personal SET cargo = 'Operador de Planta de Procesamiento' 
WHERE codigo IN (
    'PER-151', 'PER-152', 'PER-153', 'PER-154', 'PER-155', 'PER-156', 'PER-157',
    'PER-158', 'PER-159', 'PER-160', 'PER-161', 'PER-162', 'PER-163', 'PER-164',
    'PER-165', 'PER-166', 'PER-167', 'PER-168', 'PER-169', 'PER-170', 'PER-171',
    'PER-172', 'PER-173', 'PER-174', 'PER-175', 'PER-176', 'PER-177', 'PER-178',
    'PER-179', 'PER-180', 'PER-181', 'PER-182', 'PER-183', 'PER-184', 'PER-185',
    'PER-186', 'PER-187', 'PER-188', 'PER-189', 'PER-190', 'PER-191', 'PER-192',
    'PER-193', 'PER-194', 'PER-195', 'PER-196', 'PER-197', 'PER-198', 'PER-199',
    'PER-200', 'PER-201', 'PER-202', 'PER-203', 'PER-204', 'PER-205', 'PER-206',
    'PER-207', 'PER-208', 'PER-209', 'PER-210', 'PER-211', 'PER-212'
) LIMIT 60;

-- Ayudantes de Planta (20)
UPDATE personal SET cargo = 'Ayudante de Planta de Procesamiento' 
WHERE codigo IN (
    'PER-213', 'PER-214', 'PER-215', 'PER-216', 'PER-217', 'PER-218', 'PER-219',
    'PER-220', 'PER-221', 'PER-222', 'PER-223', 'PER-224', 'PER-225', 'PER-226',
    'PER-227', 'PER-228', 'PER-229', 'PER-230', 'PER-231', 'PER-232'
) LIMIT 20;

-- MANTENIMIENTO MECÁNICO (150 personas)
-- Mecánicos de Equipos Pesados (100)
UPDATE personal SET cargo = 'Mecánico de Equipos Pesados' 
WHERE codigo IN (
    'PER-233', 'PER-234', 'PER-235', 'PER-236', 'PER-237', 'PER-238', 'PER-239',
    'PER-240', 'PER-241', 'PER-242', 'PER-243', 'PER-244', 'PER-245', 'PER-246',
    'PER-247', 'PER-248', 'PER-249', 'PER-250', 'PER-251', 'PER-252', 'PER-253',
    'PER-254', 'PER-255', 'PER-256', 'PER-257', 'PER-258', 'PER-259', 'PER-260',
    'PER-261', 'PER-262', 'PER-263', 'PER-264', 'PER-265', 'PER-266', 'PER-267',
    'PER-268', 'PER-269', 'PER-270', 'PER-271', 'PER-272', 'PER-273', 'PER-274',
    'PER-275', 'PER-276', 'PER-277', 'PER-278', 'PER-279', 'PER-280', 'PER-281',
    'PER-282', 'PER-283', 'PER-284', 'PER-285', 'PER-286', 'PER-287', 'PER-288',
    'PER-289', 'PER-290', 'PER-291', 'PER-292', 'PER-293', 'PER-294', 'PER-295',
    'PER-296', 'PER-297', 'PER-298', 'PER-299', 'PER-300', 'PER-301', 'PER-302',
    'PER-303', 'PER-304', 'PER-305', 'PER-306', 'PER-307', 'PER-308', 'PER-309',
    'PER-310', 'PER-311', 'PER-312', 'PER-313', 'PER-314', 'PER-315', 'PER-316',
    'PER-317', 'PER-318', 'PER-319', 'PER-320', 'PER-321', 'PER-322', 'PER-323',
    'PER-324', 'PER-325', 'PER-326', 'PER-327', 'PER-328', 'PER-329', 'PER-330',
    'PER-331', 'PER-332', 'PER-333'
) LIMIT 100;

-- Técnicos Especializados (30)
-- Técnicos en Hidráulica (15)
UPDATE personal SET cargo = 'Técnico en Hidráulica Industrial' 
WHERE codigo IN (
    'PER-209', 'PER-210', 'PER-211', 'PER-212', 'PER-213', 'PER-214', 'PER-215',
    'PER-216', 'PER-217', 'PER-218', 'PER-219', 'PER-220', 'PER-221', 'PER-222',
    'PER-223'
) LIMIT 15;

-- Técnicos en Motores (10)
UPDATE personal SET cargo = 'Técnico en Motores Diesel' 
WHERE codigo IN (
    'PER-239', 'PER-240', 'PER-241', 'PER-242', 'PER-243', 'PER-244', 'PER-245',
    'PER-246', 'PER-247', 'PER-248'
) LIMIT 10;

-- Soldadores (5)
UPDATE personal SET cargo = 'Soldador Industrial' 
WHERE codigo IN (
    'PER-259', 'PER-260', 'PER-261', 'PER-262', 'PER-263'
) LIMIT 5;

-- Lubricadores (20)
UPDATE personal SET cargo = 'Lubricador de Equipos Mineros' 
WHERE codigo IN (
    'PER-274', 'PER-275', 'PER-276', 'PER-277', 'PER-278', 'PER-279', 'PER-280',
    'PER-281', 'PER-282', 'PER-283', 'PER-334', 'PER-335', 'PER-336', 'PER-337',
    'PER-338', 'PER-339', 'PER-340', 'PER-341', 'PER-342', 'PER-343'
) LIMIT 20;

-- MANTENIMIENTO ELÉCTRICO (60 personas)
-- Electricistas Industriales (55)
UPDATE personal SET cargo = 'Electricista Industrial' 
WHERE codigo IN (
    'PER-284', 'PER-285', 'PER-286', 'PER-287', 'PER-288', 'PER-289', 'PER-290',
    'PER-291', 'PER-292', 'PER-293', 'PER-294', 'PER-295', 'PER-296', 'PER-297',
    'PER-298', 'PER-299', 'PER-300', 'PER-301', 'PER-302', 'PER-303', 'PER-304',
    'PER-305', 'PER-306', 'PER-307', 'PER-308', 'PER-309', 'PER-310', 'PER-311',
    'PER-312', 'PER-313', 'PER-314', 'PER-315', 'PER-316', 'PER-317', 'PER-318',
    'PER-319', 'PER-320', 'PER-321', 'PER-322', 'PER-323', 'PER-482', 'PER-483',
    'PER-484', 'PER-485', 'PER-486', 'PER-487', 'PER-488', 'PER-489', 'PER-490',
    'PER-491', 'PER-492', 'PER-493', 'PER-494', 'PER-495', 'PER-496', 'PER-497',
    'PER-498'
) LIMIT 55;

-- Técnicos Eléctricos (5)
UPDATE personal SET cargo = 'Técnico Eléctrico' 
WHERE codigo IN (
    'PER-499', 'PER-500', 'PER-344', 'PER-345', 'PER-346'
) LIMIT 5;

-- SEGURIDAD MINERA (50 personas)
-- Inspectores de Seguridad (25)
UPDATE personal SET cargo = 'Inspector de Seguridad Minera' 
WHERE codigo IN (
    'PER-324', 'PER-325', 'PER-326', 'PER-327', 'PER-328', 'PER-329', 'PER-330',
    'PER-331', 'PER-332', 'PER-333', 'PER-334', 'PER-335', 'PER-336', 'PER-337',
    'PER-338', 'PER-339', 'PER-340', 'PER-341', 'PER-342', 'PER-343', 'PER-497',
    'PER-498', 'PER-499', 'PER-500', 'PER-347'
) LIMIT 25;

-- Técnicos en Seguridad (20)
UPDATE personal SET cargo = 'Técnico en Seguridad Minera' 
WHERE codigo IN (
    'PER-344', 'PER-345', 'PER-346', 'PER-347', 'PER-348', 'PER-349', 'PER-350',
    'PER-351', 'PER-352', 'PER-353', 'PER-354', 'PER-355', 'PER-356', 'PER-357',
    'PER-358', 'PER-359', 'PER-360', 'PER-361', 'PER-362', 'PER-363'
) LIMIT 20;

-- Guardias de Seguridad (5)
UPDATE personal SET cargo = 'Guardia de Seguridad Minera' 
WHERE codigo IN (
    'PER-364', 'PER-365', 'PER-366', 'PER-367', 'PER-368'
) LIMIT 5;

-- ADMINISTRACIÓN Y FINANZAS (30 personas)
-- Contadores (10)
UPDATE personal SET cargo = 'Contador' 
WHERE codigo IN (
    'PER-394', 'PER-395', 'PER-396', 'PER-397', 'PER-398', 'PER-399', 'PER-400',
    'PER-401', 'PER-402', 'PER-403'
) LIMIT 10;

-- Auxiliares Contables (15)
UPDATE personal SET cargo = 'Auxiliar Contable' 
WHERE codigo IN (
    'PER-404', 'PER-405', 'PER-406', 'PER-407', 'PER-408', 'PER-409', 'PER-410',
    'PER-411', 'PER-412', 'PER-413', 'PER-414', 'PER-415', 'PER-416', 'PER-417',
    'PER-418'
) LIMIT 15;

-- Administrativos (5)
UPDATE personal SET cargo = 'Administrativo' 
WHERE codigo IN (
    'PER-369', 'PER-370', 'PER-371', 'PER-372', 'PER-373'
) LIMIT 5;

-- RECURSOS HUMANOS (15 personas)
-- Especialistas en RRHH (8)
UPDATE personal SET cargo = 'Especialista en Recursos Humanos' 
WHERE codigo IN (
    'PER-419', 'PER-420', 'PER-421', 'PER-422', 'PER-423', 'PER-424', 'PER-425',
    'PER-426'
) LIMIT 8;

-- Asistentes de RRHH (7)
UPDATE personal SET cargo = 'Asistente de Recursos Humanos' 
WHERE codigo IN (
    'PER-427', 'PER-428', 'PER-429', 'PER-430', 'PER-431', 'PER-432', 'PER-433'
) LIMIT 7;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT 'Reorganización completada' AS resultado;
SELECT cargo, COUNT(*) as total FROM personal GROUP BY cargo ORDER BY 
    CASE cargo
        WHEN 'Gerente General' THEN 1
        WHEN 'Gerente de Operaciones Mineras' THEN 2
        WHEN 'Gerente de Mantenimiento' THEN 3
        WHEN 'Gerente de Seguridad y Salud Ocupacional' THEN 4
        WHEN 'Gerente Administrativo y Financiero' THEN 5
        WHEN 'Gerente de Recursos Humanos' THEN 6
        WHEN 'Superintendente de Mina' THEN 7
        WHEN 'Superintendente de Planta' THEN 8
        WHEN 'Superintendente de Mantenimiento' THEN 9
        WHEN 'Superintendente de Seguridad y Salud Ocupacional' THEN 10
        ELSE 99
    END, total DESC;

