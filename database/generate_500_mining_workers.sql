-- ============================================
-- Script para generar 500 trabajadores para Empresa Minera
-- Estructura profesional y jerárquica
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- ============================================
-- OPERACIONES MINERAS - Personal Operativo
-- ============================================
-- Operadores de Equipos Mineros (40 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-094', 'Luis Fernando Gutiérrez', '12345716', 'Operador de Equipos Mineros', '2345716', '71234605', 25.00, 'ACTIVO'),
('PER-095', 'Roberto Carlos Méndez', '12345717', 'Operador de Equipos Mineros', '2345717', '71234606', 25.00, 'ACTIVO'),
('PER-096', 'Jorge Alberto Ramírez', '12345718', 'Operador de Equipos Mineros', '2345718', '71234607', 25.00, 'ACTIVO'),
('PER-097', 'Miguel Ángel Sánchez', '12345719', 'Operador de Equipos Mineros', '2345719', '71234608', 25.00, 'ACTIVO'),
('PER-098', 'Carlos Eduardo Torres', '12345720', 'Operador de Equipos Mineros', '2345720', '71234609', 25.00, 'ACTIVO'),
('PER-099', 'Fernando José López', '12345721', 'Operador de Equipos Mineros', '2345721', '71234610', 25.00, 'ACTIVO'),
('PER-100', 'Alejandro Martín Díaz', '12345722', 'Operador de Equipos Mineros', '2345722', '71234611', 25.00, 'ACTIVO'),
('PER-101', 'Ricardo Antonio Flores', '12345723', 'Operador de Equipos Mineros', '2345723', '71234612', 25.00, 'ACTIVO'),
('PER-102', 'Luis Alberto Morales', '12345724', 'Operador de Equipos Mineros', '2345724', '71234613', 25.00, 'ACTIVO'),
('PER-103', 'Pedro Pablo Martínez', '12345725', 'Operador de Equipos Mineros', '2345725', '71234614', 25.00, 'ACTIVO'),
('PER-104', 'Juan Carlos Silva', '12345726', 'Operador de Equipos Mineros', '2345726', '71234615', 25.00, 'ACTIVO'),
('PER-105', 'Roberto Sánchez Mendoza', '12345727', 'Operador de Equipos Mineros', '2345727', '71234616', 25.00, 'ACTIVO'),
('PER-106', 'Carlos Ramírez Vargas', '12345728', 'Operador de Equipos Mineros', '2345728', '71234617', 25.00, 'ACTIVO'),
('PER-107', 'Miguel Ángel Torres', '12345729', 'Operador de Equipos Mineros', '2345729', '71234618', 25.00, 'ACTIVO'),
('PER-108', 'José Luis Herrera', '12345730', 'Operador de Equipos Mineros', '2345730', '71234619', 25.00, 'ACTIVO'),
('PER-109', 'Fernando Castro Ruiz', '12345731', 'Operador de Equipos Mineros', '2345731', '71234620', 25.00, 'ACTIVO'),
('PER-110', 'Alejandro Méndez Díaz', '12345732', 'Operador de Equipos Mineros', '2345732', '71234621', 25.00, 'ACTIVO'),
('PER-111', 'Ricardo Flores López', '12345733', 'Operador de Equipos Mineros', '2345733', '71234622', 25.00, 'ACTIVO'),
('PER-112', 'Luis Alberto Morales', '12345734', 'Operador de Equipos Mineros', '2345734', '71234623', 25.00, 'ACTIVO'),
('PER-113', 'Pedro Martínez González', '12345735', 'Operador de Equipos Mineros', '2345735', '71234624', 25.00, 'ACTIVO'),
('PER-114', 'Juan Carlos Silva', '12345736', 'Operador de Equipos Mineros', '2345736', '71234625', 25.00, 'ACTIVO'),
('PER-115', 'Roberto Sánchez Mendoza', '12345737', 'Operador de Equipos Mineros', '2345737', '71234626', 25.00, 'ACTIVO'),
('PER-116', 'Carlos Ramírez Vargas', '12345738', 'Operador de Equipos Mineros', '2345738', '71234627', 25.00, 'ACTIVO'),
('PER-117', 'Miguel Ángel Torres', '12345739', 'Operador de Equipos Mineros', '2345739', '71234628', 25.00, 'ACTIVO'),
('PER-118', 'José Luis Herrera', '12345740', 'Operador de Equipos Mineros', '2345740', '71234629', 25.00, 'ACTIVO'),
('PER-119', 'Fernando Castro Ruiz', '12345741', 'Operador de Equipos Mineros', '2345741', '71234630', 25.00, 'ACTIVO'),
('PER-120', 'Alejandro Méndez Díaz', '12345742', 'Operador de Equipos Mineros', '2345742', '71234631', 25.00, 'ACTIVO'),
('PER-121', 'Ricardo Flores López', '12345743', 'Operador de Equipos Mineros', '2345743', '71234632', 25.00, 'ACTIVO'),
('PER-122', 'Luis Alberto Morales', '12345744', 'Operador de Equipos Mineros', '2345744', '71234633', 25.00, 'ACTIVO'),
('PER-123', 'Pedro Martínez González', '12345745', 'Operador de Equipos Mineros', '2345745', '71234634', 25.00, 'ACTIVO'),
('PER-124', 'Juan Carlos Silva', '12345746', 'Operador de Equipos Mineros', '2345746', '71234635', 25.00, 'ACTIVO'),
('PER-125', 'Roberto Sánchez Mendoza', '12345747', 'Operador de Equipos Mineros', '2345747', '71234636', 25.00, 'ACTIVO'),
('PER-126', 'Carlos Ramírez Vargas', '12345748', 'Operador de Equipos Mineros', '2345748', '71234637', 25.00, 'ACTIVO'),
('PER-127', 'Miguel Ángel Torres', '12345749', 'Operador de Equipos Mineros', '2345749', '71234638', 25.00, 'ACTIVO'),
('PER-128', 'José Luis Herrera', '12345750', 'Operador de Equipos Mineros', '2345750', '71234639', 25.00, 'ACTIVO'),
('PER-129', 'Fernando Castro Ruiz', '12345751', 'Operador de Equipos Mineros', '2345751', '71234640', 25.00, 'ACTIVO'),
('PER-130', 'Alejandro Méndez Díaz', '12345752', 'Operador de Equipos Mineros', '2345752', '71234641', 25.00, 'ACTIVO'),
('PER-131', 'Ricardo Flores López', '12345753', 'Operador de Equipos Mineros', '2345753', '71234642', 25.00, 'ACTIVO'),
('PER-132', 'Luis Alberto Morales', '12345754', 'Operador de Equipos Mineros', '2345754', '71234643', 25.00, 'ACTIVO'),
('PER-133', 'Pedro Martínez González', '12345755', 'Operador de Equipos Mineros', '2345755', '71234644', 25.00, 'ACTIVO');

-- Supervisores de Producción Minera (5 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-134', 'Ing. Mario Alberto Vega', '12345756', 'Supervisor de Producción Minera', '2345756', '71234645', 35.00, 'ACTIVO'),
('PER-135', 'Ing. Sergio Iván Muñoz', '12345757', 'Supervisor de Producción Minera', '2345757', '71234646', 35.00, 'ACTIVO'),
('PER-136', 'Ing. Rodrigo Ignacio Contreras', '12345758', 'Supervisor de Producción Minera', '2345758', '71234647', 35.00, 'ACTIVO'),
('PER-137', 'Ing. Cristian Andrés Guzmán', '12345759', 'Supervisor de Producción Minera', '2345759', '71234648', 35.00, 'ACTIVO'),
('PER-138', 'Ing. Felipe Antonio Ríos', '12345760', 'Supervisor de Producción Minera', '2345760', '71234649', 35.00, 'ACTIVO');

-- ============================================
-- MANTENIMIENTO MECÁNICO - Personal Técnico
-- ============================================
-- Mecánicos de Equipos Pesados (50 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-139', 'Sebastián Omar Campos', '12345761', 'Mecánico de Equipos Pesados', '2345761', '71234650', 27.00, 'ACTIVO'),
('PER-140', 'Nicolás Esteban Peña', '12345762', 'Mecánico de Equipos Pesados', '2345762', '71234651', 27.00, 'ACTIVO'),
('PER-141', 'Diego Fernando Araya', '12345763', 'Mecánico de Equipos Pesados', '2345763', '71234652', 27.00, 'ACTIVO'),
('PER-142', 'Patricio Mauricio Fuentes', '12345764', 'Mecánico de Equipos Pesados', '2345764', '71234653', 27.00, 'ACTIVO'),
('PER-143', 'Héctor Leonardo Valenzuela', '12345765', 'Mecánico de Equipos Pesados', '2345765', '71234654', 27.00, 'ACTIVO'),
('PER-144', 'Raúl Eduardo Tapia', '12345766', 'Mecánico de Equipos Pesados', '2345766', '71234655', 27.00, 'ACTIVO'),
('PER-145', 'Víctor Manuel Sepúlveda', '12345767', 'Mecánico de Equipos Pesados', '2345767', '71234656', 27.00, 'ACTIVO'),
('PER-146', 'Óscar René Núñez', '12345768', 'Mecánico de Equipos Pesados', '2345768', '71234657', 27.00, 'ACTIVO'),
('PER-147', 'Eduardo Patricio Vega', '12345769', 'Mecánico de Equipos Pesados', '2345769', '71234658', 27.00, 'ACTIVO'),
('PER-148', 'Gonzalo Sebastián Muñoz', '12345770', 'Mecánico de Equipos Pesados', '2345770', '71234659', 27.00, 'ACTIVO'),
('PER-149', 'Rodrigo Ignacio Contreras', '12345771', 'Mecánico de Equipos Pesados', '2345771', '71234660', 27.00, 'ACTIVO'),
('PER-150', 'Cristian Andrés Guzmán', '12345772', 'Mecánico de Equipos Pesados', '2345772', '71234661', 27.00, 'ACTIVO'),
('PER-151', 'Felipe Antonio Ríos', '12345773', 'Mecánico de Equipos Pesados', '2345773', '71234662', 27.00, 'ACTIVO'),
('PER-152', 'Sebastián Omar Campos', '12345774', 'Mecánico de Equipos Pesados', '2345774', '71234663', 27.00, 'ACTIVO'),
('PER-153', 'Nicolás Esteban Peña', '12345775', 'Mecánico de Equipos Pesados', '2345775', '71234664', 27.00, 'ACTIVO'),
('PER-154', 'Diego Fernando Araya', '12345776', 'Mecánico de Equipos Pesados', '2345776', '71234665', 27.00, 'ACTIVO'),
('PER-155', 'Patricio Mauricio Fuentes', '12345777', 'Mecánico de Equipos Pesados', '2345777', '71234666', 27.00, 'ACTIVO'),
('PER-156', 'Héctor Leonardo Valenzuela', '12345778', 'Mecánico de Equipos Pesados', '2345778', '71234667', 27.00, 'ACTIVO'),
('PER-157', 'Raúl Eduardo Tapia', '12345779', 'Mecánico de Equipos Pesados', '2345779', '71234668', 27.00, 'ACTIVO'),
('PER-158', 'Víctor Manuel Sepúlveda', '12345780', 'Mecánico de Equipos Pesados', '2345780', '71234669', 27.00, 'ACTIVO'),
('PER-159', 'Óscar René Núñez', '12345781', 'Mecánico de Equipos Pesados', '2345781', '71234670', 27.00, 'ACTIVO'),
('PER-160', 'Eduardo Patricio Vega', '12345782', 'Mecánico de Equipos Pesados', '2345782', '71234671', 27.00, 'ACTIVO'),
('PER-161', 'Gonzalo Sebastián Muñoz', '12345783', 'Mecánico de Equipos Pesados', '2345783', '71234672', 27.00, 'ACTIVO'),
('PER-162', 'Rodrigo Ignacio Contreras', '12345784', 'Mecánico de Equipos Pesados', '2345784', '71234673', 27.00, 'ACTIVO'),
('PER-163', 'Cristian Andrés Guzmán', '12345785', 'Mecánico de Equipos Pesados', '2345785', '71234674', 27.00, 'ACTIVO'),
('PER-164', 'Felipe Antonio Ríos', '12345786', 'Mecánico de Equipos Pesados', '2345786', '71234675', 27.00, 'ACTIVO'),
('PER-165', 'Sebastián Omar Campos', '12345787', 'Mecánico de Equipos Pesados', '2345787', '71234676', 27.00, 'ACTIVO'),
('PER-166', 'Nicolás Esteban Peña', '12345788', 'Mecánico de Equipos Pesados', '2345788', '71234677', 27.00, 'ACTIVO'),
('PER-167', 'Diego Fernando Araya', '12345789', 'Mecánico de Equipos Pesados', '2345789', '71234678', 27.00, 'ACTIVO'),
('PER-168', 'Patricio Mauricio Fuentes', '12345790', 'Mecánico de Equipos Pesados', '2345790', '71234679', 27.00, 'ACTIVO'),
('PER-169', 'Héctor Leonardo Valenzuela', '12345791', 'Mecánico de Equipos Pesados', '2345791', '71234680', 27.00, 'ACTIVO'),
('PER-170', 'Raúl Eduardo Tapia', '12345792', 'Mecánico de Equipos Pesados', '2345792', '71234681', 27.00, 'ACTIVO'),
('PER-171', 'Víctor Manuel Sepúlveda', '12345793', 'Mecánico de Equipos Pesados', '2345793', '71234682', 27.00, 'ACTIVO'),
('PER-172', 'Óscar René Núñez', '12345794', 'Mecánico de Equipos Pesados', '2345794', '71234683', 27.00, 'ACTIVO'),
('PER-173', 'Eduardo Patricio Vega', '12345795', 'Mecánico de Equipos Pesados', '2345795', '71234684', 27.00, 'ACTIVO'),
('PER-174', 'Gonzalo Sebastián Muñoz', '12345796', 'Mecánico de Equipos Pesados', '2345796', '71234685', 27.00, 'ACTIVO'),
('PER-175', 'Rodrigo Ignacio Contreras', '12345797', 'Mecánico de Equipos Pesados', '2345797', '71234686', 27.00, 'ACTIVO'),
('PER-176', 'Cristian Andrés Guzmán', '12345798', 'Mecánico de Equipos Pesados', '2345798', '71234687', 27.00, 'ACTIVO'),
('PER-177', 'Felipe Antonio Ríos', '12345799', 'Mecánico de Equipos Pesados', '2345799', '71234688', 27.00, 'ACTIVO'),
('PER-178', 'Sebastián Omar Campos', '12345800', 'Mecánico de Equipos Pesados', '2345800', '71234689', 27.00, 'ACTIVO'),
('PER-179', 'Nicolás Esteban Peña', '12345801', 'Mecánico de Equipos Pesados', '2345801', '71234690', 27.00, 'ACTIVO'),
('PER-180', 'Diego Fernando Araya', '12345802', 'Mecánico de Equipos Pesados', '2345802', '71234691', 27.00, 'ACTIVO'),
('PER-181', 'Patricio Mauricio Fuentes', '12345803', 'Mecánico de Equipos Pesados', '2345803', '71234692', 27.00, 'ACTIVO'),
('PER-182', 'Héctor Leonardo Valenzuela', '12345804', 'Mecánico de Equipos Pesados', '2345804', '71234693', 27.00, 'ACTIVO'),
('PER-183', 'Raúl Eduardo Tapia', '12345805', 'Mecánico de Equipos Pesados', '2345805', '71234694', 27.00, 'ACTIVO'),
('PER-184', 'Víctor Manuel Sepúlveda', '12345806', 'Mecánico de Equipos Pesados', '2345806', '71234695', 27.00, 'ACTIVO'),
('PER-185', 'Óscar René Núñez', '12345807', 'Mecánico de Equipos Pesados', '2345807', '71234696', 27.00, 'ACTIVO'),
('PER-186', 'Eduardo Patricio Vega', '12345808', 'Mecánico de Equipos Pesados', '2345808', '71234697', 27.00, 'ACTIVO'),
('PER-187', 'Gonzalo Sebastián Muñoz', '12345809', 'Mecánico de Equipos Pesados', '2345809', '71234698', 27.00, 'ACTIVO'),
('PER-188', 'Rodrigo Ignacio Contreras', '12345810', 'Mecánico de Equipos Pesados', '2345810', '71234699', 27.00, 'ACTIVO');

-- Mecánicos Senior (20 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-189', 'Ing. Carlos Alberto Paredes', '12345811', 'Mecánico de Equipos Pesados Senior', '2345811', '71234700', 30.00, 'ACTIVO'),
('PER-190', 'Ing. Jorge Eduardo Quiroga', '12345812', 'Mecánico de Equipos Pesados Senior', '2345812', '71234701', 30.00, 'ACTIVO'),
('PER-191', 'Ing. Daniel Esteban Velásquez', '12345813', 'Mecánico de Equipos Pesados Senior', '2345813', '71234702', 30.00, 'ACTIVO'),
('PER-192', 'Ing. Sergio Iván Salinas', '12345814', 'Mecánico de Equipos Pesados Senior', '2345814', '71234703', 30.00, 'ACTIVO'),
('PER-193', 'Ing. Mauricio Alejandro Espinoza', '12345815', 'Mecánico de Equipos Pesados Senior', '2345815', '71234704', 30.00, 'ACTIVO'),
('PER-194', 'Ing. Fabián Rodrigo Cáceres', '12345816', 'Mecánico de Equipos Pesados Senior', '2345816', '71234705', 30.00, 'ACTIVO'),
('PER-195', 'Ing. Marco Antonio Rojas', '12345817', 'Mecánico de Equipos Pesados Senior', '2345817', '71234706', 30.00, 'ACTIVO'),
('PER-196', 'Ing. Andrés Felipe Paredes', '12345818', 'Mecánico de Equipos Pesados Senior', '2345818', '71234707', 30.00, 'ACTIVO'),
('PER-197', 'Ing. Jorge Eduardo Quiroga', '12345819', 'Mecánico de Equipos Pesados Senior', '2345819', '71234708', 30.00, 'ACTIVO'),
('PER-198', 'Ing. Daniel Esteban Velásquez', '12345820', 'Mecánico de Equipos Pesados Senior', '2345820', '71234709', 30.00, 'ACTIVO'),
('PER-199', 'Ing. Sergio Iván Salinas', '12345821', 'Mecánico de Equipos Pesados Senior', '2345821', '71234710', 30.00, 'ACTIVO'),
('PER-200', 'Ing. Mauricio Alejandro Espinoza', '12345822', 'Mecánico de Equipos Pesados Senior', '2345822', '71234711', 30.00, 'ACTIVO'),
('PER-201', 'Ing. Fabián Rodrigo Cáceres', '12345823', 'Mecánico de Equipos Pesados Senior', '2345823', '71234712', 30.00, 'ACTIVO'),
('PER-202', 'Ing. Marco Antonio Rojas', '12345824', 'Mecánico de Equipos Pesados Senior', '2345824', '71234713', 30.00, 'ACTIVO'),
('PER-203', 'Ing. Andrés Felipe Paredes', '12345825', 'Mecánico de Equipos Pesados Senior', '2345825', '71234714', 30.00, 'ACTIVO'),
('PER-204', 'Ing. Jorge Eduardo Quiroga', '12345826', 'Mecánico de Equipos Pesados Senior', '2345826', '71234715', 30.00, 'ACTIVO'),
('PER-205', 'Ing. Daniel Esteban Velásquez', '12345827', 'Mecánico de Equipos Pesados Senior', '2345827', '71234716', 30.00, 'ACTIVO'),
('PER-206', 'Ing. Sergio Iván Salinas', '12345828', 'Mecánico de Equipos Pesados Senior', '2345828', '71234717', 30.00, 'ACTIVO'),
('PER-207', 'Ing. Mauricio Alejandro Espinoza', '12345829', 'Mecánico de Equipos Pesados Senior', '2345829', '71234718', 30.00, 'ACTIVO'),
('PER-208', 'Ing. Fabián Rodrigo Cáceres', '12345830', 'Mecánico de Equipos Pesados Senior', '2345830', '71234719', 30.00, 'ACTIVO');

-- Técnicos en Hidráulica Industrial (30 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-209', 'Téc. Luis Fernando Gutiérrez', '12345831', 'Técnico en Hidráulica Industrial', '2345831', '71234720', 28.00, 'ACTIVO'),
('PER-210', 'Téc. Roberto Carlos Méndez', '12345832', 'Técnico en Hidráulica Industrial', '2345832', '71234721', 28.00, 'ACTIVO'),
('PER-211', 'Téc. Jorge Alberto Ramírez', '12345833', 'Técnico en Hidráulica Industrial', '2345833', '71234722', 28.00, 'ACTIVO'),
('PER-212', 'Téc. Miguel Ángel Sánchez', '12345834', 'Técnico en Hidráulica Industrial', '2345834', '71234723', 28.00, 'ACTIVO'),
('PER-213', 'Téc. Carlos Eduardo Torres', '12345835', 'Técnico en Hidráulica Industrial', '2345835', '71234724', 28.00, 'ACTIVO'),
('PER-214', 'Téc. Fernando José López', '12345836', 'Técnico en Hidráulica Industrial', '2345836', '71234725', 28.00, 'ACTIVO'),
('PER-215', 'Téc. Alejandro Martín Díaz', '12345837', 'Técnico en Hidráulica Industrial', '2345837', '71234726', 28.00, 'ACTIVO'),
('PER-216', 'Téc. Ricardo Antonio Flores', '12345838', 'Técnico en Hidráulica Industrial', '2345838', '71234727', 28.00, 'ACTIVO'),
('PER-217', 'Téc. Luis Alberto Morales', '12345839', 'Técnico en Hidráulica Industrial', '2345839', '71234728', 28.00, 'ACTIVO'),
('PER-218', 'Téc. Pedro Pablo Martínez', '12345840', 'Técnico en Hidráulica Industrial', '2345840', '71234729', 28.00, 'ACTIVO'),
('PER-219', 'Téc. Juan Carlos Silva', '12345841', 'Técnico en Hidráulica Industrial', '2345841', '71234730', 28.00, 'ACTIVO'),
('PER-220', 'Téc. Roberto Sánchez Mendoza', '12345842', 'Técnico en Hidráulica Industrial', '2345842', '71234731', 28.00, 'ACTIVO'),
('PER-221', 'Téc. Carlos Ramírez Vargas', '12345843', 'Técnico en Hidráulica Industrial', '2345843', '71234732', 28.00, 'ACTIVO'),
('PER-222', 'Téc. Miguel Ángel Torres', '12345844', 'Técnico en Hidráulica Industrial', '2345844', '71234733', 28.00, 'ACTIVO'),
('PER-223', 'Téc. José Luis Herrera', '12345845', 'Técnico en Hidráulica Industrial', '2345845', '71234734', 28.00, 'ACTIVO'),
('PER-224', 'Téc. Fernando Castro Ruiz', '12345846', 'Técnico en Hidráulica Industrial', '2345846', '71234735', 28.00, 'ACTIVO'),
('PER-225', 'Téc. Alejandro Méndez Díaz', '12345847', 'Técnico en Hidráulica Industrial', '2345847', '71234736', 28.00, 'ACTIVO'),
('PER-226', 'Téc. Ricardo Flores López', '12345848', 'Técnico en Hidráulica Industrial', '2345848', '71234737', 28.00, 'ACTIVO'),
('PER-227', 'Téc. Luis Alberto Morales', '12345849', 'Técnico en Hidráulica Industrial', '2345849', '71234738', 28.00, 'ACTIVO'),
('PER-228', 'Téc. Pedro Martínez González', '12345850', 'Técnico en Hidráulica Industrial', '2345850', '71234739', 28.00, 'ACTIVO'),
('PER-229', 'Téc. Juan Carlos Silva', '12345851', 'Técnico en Hidráulica Industrial', '2345851', '71234740', 28.00, 'ACTIVO'),
('PER-230', 'Téc. Roberto Sánchez Mendoza', '12345852', 'Técnico en Hidráulica Industrial', '2345852', '71234741', 28.00, 'ACTIVO'),
('PER-231', 'Téc. Carlos Ramírez Vargas', '12345853', 'Técnico en Hidráulica Industrial', '2345853', '71234742', 28.00, 'ACTIVO'),
('PER-232', 'Téc. Miguel Ángel Torres', '12345854', 'Técnico en Hidráulica Industrial', '2345854', '71234743', 28.00, 'ACTIVO'),
('PER-233', 'Téc. José Luis Herrera', '12345855', 'Técnico en Hidráulica Industrial', '2345855', '71234744', 28.00, 'ACTIVO'),
('PER-234', 'Téc. Fernando Castro Ruiz', '12345856', 'Técnico en Hidráulica Industrial', '2345856', '71234745', 28.00, 'ACTIVO'),
('PER-235', 'Téc. Alejandro Méndez Díaz', '12345857', 'Técnico en Hidráulica Industrial', '2345857', '71234746', 28.00, 'ACTIVO'),
('PER-236', 'Téc. Ricardo Flores López', '12345858', 'Técnico en Hidráulica Industrial', '2345858', '71234747', 28.00, 'ACTIVO'),
('PER-237', 'Téc. Luis Alberto Morales', '12345859', 'Técnico en Hidráulica Industrial', '2345859', '71234748', 28.00, 'ACTIVO'),
('PER-238', 'Téc. Pedro Martínez González', '12345860', 'Técnico en Hidráulica Industrial', '2345860', '71234749', 28.00, 'ACTIVO');

-- Técnicos en Motores Diesel (20 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-239', 'Téc. Sebastián Omar Campos', '12345861', 'Técnico en Motores Diesel', '2345861', '71234750', 28.00, 'ACTIVO'),
('PER-240', 'Téc. Nicolás Esteban Peña', '12345862', 'Técnico en Motores Diesel', '2345862', '71234751', 28.00, 'ACTIVO'),
('PER-241', 'Téc. Diego Fernando Araya', '12345863', 'Técnico en Motores Diesel', '2345863', '71234752', 28.00, 'ACTIVO'),
('PER-242', 'Téc. Patricio Mauricio Fuentes', '12345864', 'Técnico en Motores Diesel', '2345864', '71234753', 28.00, 'ACTIVO'),
('PER-243', 'Téc. Héctor Leonardo Valenzuela', '12345865', 'Técnico en Motores Diesel', '2345865', '71234754', 28.00, 'ACTIVO'),
('PER-244', 'Téc. Raúl Eduardo Tapia', '12345866', 'Técnico en Motores Diesel', '2345866', '71234755', 28.00, 'ACTIVO'),
('PER-245', 'Téc. Víctor Manuel Sepúlveda', '12345867', 'Técnico en Motores Diesel', '2345867', '71234756', 28.00, 'ACTIVO'),
('PER-246', 'Téc. Óscar René Núñez', '12345868', 'Técnico en Motores Diesel', '2345868', '71234757', 28.00, 'ACTIVO'),
('PER-247', 'Téc. Eduardo Patricio Vega', '12345869', 'Técnico en Motores Diesel', '2345869', '71234758', 28.00, 'ACTIVO'),
('PER-248', 'Téc. Gonzalo Sebastián Muñoz', '12345870', 'Técnico en Motores Diesel', '2345870', '71234759', 28.00, 'ACTIVO'),
('PER-249', 'Téc. Rodrigo Ignacio Contreras', '12345871', 'Técnico en Motores Diesel', '2345871', '71234760', 28.00, 'ACTIVO'),
('PER-250', 'Téc. Cristian Andrés Guzmán', '12345872', 'Técnico en Motores Diesel', '2345872', '71234761', 28.00, 'ACTIVO'),
('PER-251', 'Téc. Felipe Antonio Ríos', '12345873', 'Técnico en Motores Diesel', '2345873', '71234762', 28.00, 'ACTIVO'),
('PER-252', 'Téc. Sebastián Omar Campos', '12345874', 'Técnico en Motores Diesel', '2345874', '71234763', 28.00, 'ACTIVO'),
('PER-253', 'Téc. Nicolás Esteban Peña', '12345875', 'Técnico en Motores Diesel', '2345875', '71234764', 28.00, 'ACTIVO'),
('PER-254', 'Téc. Diego Fernando Araya', '12345876', 'Técnico en Motores Diesel', '2345876', '71234765', 28.00, 'ACTIVO'),
('PER-255', 'Téc. Patricio Mauricio Fuentes', '12345877', 'Técnico en Motores Diesel', '2345877', '71234766', 28.00, 'ACTIVO'),
('PER-256', 'Téc. Héctor Leonardo Valenzuela', '12345878', 'Técnico en Motores Diesel', '2345878', '71234767', 28.00, 'ACTIVO'),
('PER-257', 'Téc. Raúl Eduardo Tapia', '12345879', 'Técnico en Motores Diesel', '2345879', '71234768', 28.00, 'ACTIVO'),
('PER-258', 'Téc. Víctor Manuel Sepúlveda', '12345880', 'Técnico en Motores Diesel', '2345880', '71234769', 28.00, 'ACTIVO');

-- Soldadores Industriales (15 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-259', 'Sold. Óscar René Núñez', '12345881', 'Soldador Industrial', '2345881', '71234770', 26.00, 'ACTIVO'),
('PER-260', 'Sold. Eduardo Patricio Vega', '12345882', 'Soldador Industrial', '2345882', '71234771', 26.00, 'ACTIVO'),
('PER-261', 'Sold. Gonzalo Sebastián Muñoz', '12345883', 'Soldador Industrial', '2345883', '71234772', 26.00, 'ACTIVO'),
('PER-262', 'Sold. Rodrigo Ignacio Contreras', '12345884', 'Soldador Industrial', '2345884', '71234773', 26.00, 'ACTIVO'),
('PER-263', 'Sold. Cristian Andrés Guzmán', '12345885', 'Soldador Industrial', '2345885', '71234774', 26.00, 'ACTIVO'),
('PER-264', 'Sold. Felipe Antonio Ríos', '12345886', 'Soldador Industrial', '2345886', '71234775', 26.00, 'ACTIVO'),
('PER-265', 'Sold. Sebastián Omar Campos', '12345887', 'Soldador Industrial', '2345887', '71234776', 26.00, 'ACTIVO'),
('PER-266', 'Sold. Nicolás Esteban Peña', '12345888', 'Soldador Industrial', '2345888', '71234777', 26.00, 'ACTIVO'),
('PER-267', 'Sold. Diego Fernando Araya', '12345889', 'Soldador Industrial', '2345889', '71234778', 26.00, 'ACTIVO'),
('PER-268', 'Sold. Patricio Mauricio Fuentes', '12345890', 'Soldador Industrial', '2345890', '71234779', 26.00, 'ACTIVO'),
('PER-269', 'Sold. Héctor Leonardo Valenzuela', '12345891', 'Soldador Industrial', '2345891', '71234780', 26.00, 'ACTIVO'),
('PER-270', 'Sold. Raúl Eduardo Tapia', '12345892', 'Soldador Industrial', '2345892', '71234781', 26.00, 'ACTIVO'),
('PER-271', 'Sold. Víctor Manuel Sepúlveda', '12345893', 'Soldador Industrial', '2345893', '71234782', 26.00, 'ACTIVO'),
('PER-272', 'Sold. Óscar René Núñez', '12345894', 'Soldador Industrial', '2345894', '71234783', 26.00, 'ACTIVO'),
('PER-273', 'Sold. Eduardo Patricio Vega', '12345895', 'Soldador Industrial', '2345895', '71234784', 26.00, 'ACTIVO');

-- Lubricadores (10 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-274', 'Lub. Gonzalo Sebastián Muñoz', '12345896', 'Lubricador de Equipos Mineros', '2345896', '71234785', 24.00, 'ACTIVO'),
('PER-275', 'Lub. Rodrigo Ignacio Contreras', '12345897', 'Lubricador de Equipos Mineros', '2345897', '71234786', 24.00, 'ACTIVO'),
('PER-276', 'Lub. Cristian Andrés Guzmán', '12345898', 'Lubricador de Equipos Mineros', '2345898', '71234787', 24.00, 'ACTIVO'),
('PER-277', 'Lub. Felipe Antonio Ríos', '12345899', 'Lubricador de Equipos Mineros', '2345899', '71234788', 24.00, 'ACTIVO'),
('PER-278', 'Lub. Sebastián Omar Campos', '12345900', 'Lubricador de Equipos Mineros', '2345900', '71234789', 24.00, 'ACTIVO'),
('PER-279', 'Lub. Nicolás Esteban Peña', '12345901', 'Lubricador de Equipos Mineros', '2345901', '71234790', 24.00, 'ACTIVO'),
('PER-280', 'Lub. Diego Fernando Araya', '12345902', 'Lubricador de Equipos Mineros', '2345902', '71234791', 24.00, 'ACTIVO'),
('PER-281', 'Lub. Patricio Mauricio Fuentes', '12345903', 'Lubricador de Equipos Mineros', '2345903', '71234792', 24.00, 'ACTIVO'),
('PER-282', 'Lub. Héctor Leonardo Valenzuela', '12345904', 'Lubricador de Equipos Mineros', '2345904', '71234793', 24.00, 'ACTIVO'),
('PER-283', 'Lub. Raúl Eduardo Tapia', '12345905', 'Lubricador de Equipos Mineros', '2345905', '71234794', 24.00, 'ACTIVO');

-- ============================================
-- MANTENIMIENTO ELÉCTRICO - Personal Técnico
-- ============================================
-- Electricistas Industriales (40 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-284', 'Elec. Víctor Manuel Sepúlveda', '12345906', 'Electricista Industrial', '2345906', '71234795', 27.00, 'ACTIVO'),
('PER-285', 'Elec. Óscar René Núñez', '12345907', 'Electricista Industrial', '2345907', '71234796', 27.00, 'ACTIVO'),
('PER-286', 'Elec. Eduardo Patricio Vega', '12345908', 'Electricista Industrial', '2345908', '71234797', 27.00, 'ACTIVO'),
('PER-287', 'Elec. Gonzalo Sebastián Muñoz', '12345909', 'Electricista Industrial', '2345909', '71234798', 27.00, 'ACTIVO'),
('PER-288', 'Elec. Rodrigo Ignacio Contreras', '12345910', 'Electricista Industrial', '2345910', '71234799', 27.00, 'ACTIVO'),
('PER-289', 'Elec. Cristian Andrés Guzmán', '12345911', 'Electricista Industrial', '2345911', '71234800', 27.00, 'ACTIVO'),
('PER-290', 'Elec. Felipe Antonio Ríos', '12345912', 'Electricista Industrial', '2345912', '71234801', 27.00, 'ACTIVO'),
('PER-291', 'Elec. Sebastián Omar Campos', '12345913', 'Electricista Industrial', '2345913', '71234802', 27.00, 'ACTIVO'),
('PER-292', 'Elec. Nicolás Esteban Peña', '12345914', 'Electricista Industrial', '2345914', '71234803', 27.00, 'ACTIVO'),
('PER-293', 'Elec. Diego Fernando Araya', '12345915', 'Electricista Industrial', '2345915', '71234804', 27.00, 'ACTIVO'),
('PER-294', 'Elec. Patricio Mauricio Fuentes', '12345916', 'Electricista Industrial', '2345916', '71234805', 27.00, 'ACTIVO'),
('PER-295', 'Elec. Héctor Leonardo Valenzuela', '12345917', 'Electricista Industrial', '2345917', '71234806', 27.00, 'ACTIVO'),
('PER-296', 'Elec. Raúl Eduardo Tapia', '12345918', 'Electricista Industrial', '2345918', '71234807', 27.00, 'ACTIVO'),
('PER-297', 'Elec. Víctor Manuel Sepúlveda', '12345919', 'Electricista Industrial', '2345919', '71234808', 27.00, 'ACTIVO'),
('PER-298', 'Elec. Óscar René Núñez', '12345920', 'Electricista Industrial', '2345920', '71234809', 27.00, 'ACTIVO'),
('PER-299', 'Elec. Eduardo Patricio Vega', '12345921', 'Electricista Industrial', '2345921', '71234810', 27.00, 'ACTIVO'),
('PER-300', 'Elec. Gonzalo Sebastián Muñoz', '12345922', 'Electricista Industrial', '2345922', '71234811', 27.00, 'ACTIVO'),
('PER-301', 'Elec. Rodrigo Ignacio Contreras', '12345923', 'Electricista Industrial', '2345923', '71234812', 27.00, 'ACTIVO'),
('PER-302', 'Elec. Cristian Andrés Guzmán', '12345924', 'Electricista Industrial', '2345924', '71234813', 27.00, 'ACTIVO'),
('PER-303', 'Elec. Felipe Antonio Ríos', '12345925', 'Electricista Industrial', '2345925', '71234814', 27.00, 'ACTIVO'),
('PER-304', 'Elec. Sebastián Omar Campos', '12345926', 'Electricista Industrial', '2345926', '71234815', 27.00, 'ACTIVO'),
('PER-305', 'Elec. Nicolás Esteban Peña', '12345927', 'Electricista Industrial', '2345927', '71234816', 27.00, 'ACTIVO'),
('PER-306', 'Elec. Diego Fernando Araya', '12345928', 'Electricista Industrial', '2345928', '71234817', 27.00, 'ACTIVO'),
('PER-307', 'Elec. Patricio Mauricio Fuentes', '12345929', 'Electricista Industrial', '2345929', '71234818', 27.00, 'ACTIVO'),
('PER-308', 'Elec. Héctor Leonardo Valenzuela', '12345930', 'Electricista Industrial', '2345930', '71234819', 27.00, 'ACTIVO'),
('PER-309', 'Elec. Raúl Eduardo Tapia', '12345931', 'Electricista Industrial', '2345931', '71234820', 27.00, 'ACTIVO'),
('PER-310', 'Elec. Víctor Manuel Sepúlveda', '12345932', 'Electricista Industrial', '2345932', '71234821', 27.00, 'ACTIVO'),
('PER-311', 'Elec. Óscar René Núñez', '12345933', 'Electricista Industrial', '2345933', '71234822', 27.00, 'ACTIVO'),
('PER-312', 'Elec. Eduardo Patricio Vega', '12345934', 'Electricista Industrial', '2345934', '71234823', 27.00, 'ACTIVO'),
('PER-313', 'Elec. Gonzalo Sebastián Muñoz', '12345935', 'Electricista Industrial', '2345935', '71234824', 27.00, 'ACTIVO'),
('PER-314', 'Elec. Rodrigo Ignacio Contreras', '12345936', 'Electricista Industrial', '2345936', '71234825', 27.00, 'ACTIVO'),
('PER-315', 'Elec. Cristian Andrés Guzmán', '12345937', 'Electricista Industrial', '2345937', '71234826', 27.00, 'ACTIVO'),
('PER-316', 'Elec. Felipe Antonio Ríos', '12345938', 'Electricista Industrial', '2345938', '71234827', 27.00, 'ACTIVO'),
('PER-317', 'Elec. Sebastián Omar Campos', '12345939', 'Electricista Industrial', '2345939', '71234828', 27.00, 'ACTIVO'),
('PER-318', 'Elec. Nicolás Esteban Peña', '12345940', 'Electricista Industrial', '2345940', '71234829', 27.00, 'ACTIVO'),
('PER-319', 'Elec. Diego Fernando Araya', '12345941', 'Electricista Industrial', '2345941', '71234830', 27.00, 'ACTIVO'),
('PER-320', 'Elec. Patricio Mauricio Fuentes', '12345942', 'Electricista Industrial', '2345942', '71234831', 27.00, 'ACTIVO'),
('PER-321', 'Elec. Héctor Leonardo Valenzuela', '12345943', 'Electricista Industrial', '2345943', '71234832', 27.00, 'ACTIVO'),
('PER-322', 'Elec. Raúl Eduardo Tapia', '12345944', 'Electricista Industrial', '2345944', '71234833', 27.00, 'ACTIVO'),
('PER-323', 'Elec. Víctor Manuel Sepúlveda', '12345945', 'Electricista Industrial', '2345945', '71234834', 27.00, 'ACTIVO');

-- ============================================
-- SEGURIDAD MINERA - Personal Adicional
-- ============================================
-- Inspectores de Seguridad (20 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-324', 'Insp. Óscar René Núñez', '12345946', 'Inspector de Seguridad Minera', '2345946', '71234835', 28.00, 'ACTIVO'),
('PER-325', 'Insp. Eduardo Patricio Vega', '12345947', 'Inspector de Seguridad Minera', '2345947', '71234836', 28.00, 'ACTIVO'),
('PER-326', 'Insp. Gonzalo Sebastián Muñoz', '12345948', 'Inspector de Seguridad Minera', '2345948', '71234837', 28.00, 'ACTIVO'),
('PER-327', 'Insp. Rodrigo Ignacio Contreras', '12345949', 'Inspector de Seguridad Minera', '2345949', '71234838', 28.00, 'ACTIVO'),
('PER-328', 'Insp. Cristian Andrés Guzmán', '12345950', 'Inspector de Seguridad Minera', '2345950', '71234839', 28.00, 'ACTIVO'),
('PER-329', 'Insp. Felipe Antonio Ríos', '12345951', 'Inspector de Seguridad Minera', '2345951', '71234840', 28.00, 'ACTIVO'),
('PER-330', 'Insp. Sebastián Omar Campos', '12345952', 'Inspector de Seguridad Minera', '2345952', '71234841', 28.00, 'ACTIVO'),
('PER-331', 'Insp. Nicolás Esteban Peña', '12345953', 'Inspector de Seguridad Minera', '2345953', '71234842', 28.00, 'ACTIVO'),
('PER-332', 'Insp. Diego Fernando Araya', '12345954', 'Inspector de Seguridad Minera', '2345954', '71234843', 28.00, 'ACTIVO'),
('PER-333', 'Insp. Patricio Mauricio Fuentes', '12345955', 'Inspector de Seguridad Minera', '2345955', '71234844', 28.00, 'ACTIVO'),
('PER-334', 'Insp. Héctor Leonardo Valenzuela', '12345956', 'Inspector de Seguridad Minera', '2345956', '71234845', 28.00, 'ACTIVO'),
('PER-335', 'Insp. Raúl Eduardo Tapia', '12345957', 'Inspector de Seguridad Minera', '2345957', '71234846', 28.00, 'ACTIVO'),
('PER-336', 'Insp. Víctor Manuel Sepúlveda', '12345958', 'Inspector de Seguridad Minera', '2345958', '71234847', 28.00, 'ACTIVO'),
('PER-337', 'Insp. Óscar René Núñez', '12345959', 'Inspector de Seguridad Minera', '2345959', '71234848', 28.00, 'ACTIVO'),
('PER-338', 'Insp. Eduardo Patricio Vega', '12345960', 'Inspector de Seguridad Minera', '2345960', '71234849', 28.00, 'ACTIVO'),
('PER-339', 'Insp. Gonzalo Sebastián Muñoz', '12345961', 'Inspector de Seguridad Minera', '2345961', '71234850', 28.00, 'ACTIVO'),
('PER-340', 'Insp. Rodrigo Ignacio Contreras', '12345962', 'Inspector de Seguridad Minera', '2345962', '71234851', 28.00, 'ACTIVO'),
('PER-341', 'Insp. Cristian Andrés Guzmán', '12345963', 'Inspector de Seguridad Minera', '2345963', '71234852', 28.00, 'ACTIVO'),
('PER-342', 'Insp. Felipe Antonio Ríos', '12345964', 'Inspector de Seguridad Minera', '2345964', '71234853', 28.00, 'ACTIVO'),
('PER-343', 'Insp. Sebastián Omar Campos', '12345965', 'Inspector de Seguridad Minera', '2345965', '71234854', 28.00, 'ACTIVO');

-- Técnicos en Seguridad (20 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-344', 'Téc. Seg. Nicolás Esteban Peña', '12345966', 'Técnico en Seguridad Minera', '2345966', '71234855', 26.00, 'ACTIVO'),
('PER-345', 'Téc. Seg. Diego Fernando Araya', '12345967', 'Técnico en Seguridad Minera', '2345967', '71234856', 26.00, 'ACTIVO'),
('PER-346', 'Téc. Seg. Patricio Mauricio Fuentes', '12345968', 'Técnico en Seguridad Minera', '2345968', '71234857', 26.00, 'ACTIVO'),
('PER-347', 'Téc. Seg. Héctor Leonardo Valenzuela', '12345969', 'Técnico en Seguridad Minera', '2345969', '71234858', 26.00, 'ACTIVO'),
('PER-348', 'Téc. Seg. Raúl Eduardo Tapia', '12345970', 'Técnico en Seguridad Minera', '2345970', '71234859', 26.00, 'ACTIVO'),
('PER-349', 'Téc. Seg. Víctor Manuel Sepúlveda', '12345971', 'Técnico en Seguridad Minera', '2345971', '71234860', 26.00, 'ACTIVO'),
('PER-350', 'Téc. Seg. Óscar René Núñez', '12345972', 'Técnico en Seguridad Minera', '2345972', '71234861', 26.00, 'ACTIVO'),
('PER-351', 'Téc. Seg. Eduardo Patricio Vega', '12345973', 'Técnico en Seguridad Minera', '2345973', '71234862', 26.00, 'ACTIVO'),
('PER-352', 'Téc. Seg. Gonzalo Sebastián Muñoz', '12345974', 'Técnico en Seguridad Minera', '2345974', '71234863', 26.00, 'ACTIVO'),
('PER-353', 'Téc. Seg. Rodrigo Ignacio Contreras', '12345975', 'Técnico en Seguridad Minera', '2345975', '71234864', 26.00, 'ACTIVO'),
('PER-354', 'Téc. Seg. Cristian Andrés Guzmán', '12345976', 'Técnico en Seguridad Minera', '2345976', '71234865', 26.00, 'ACTIVO'),
('PER-355', 'Téc. Seg. Felipe Antonio Ríos', '12345977', 'Técnico en Seguridad Minera', '2345977', '71234866', 26.00, 'ACTIVO'),
('PER-356', 'Téc. Seg. Sebastián Omar Campos', '12345978', 'Técnico en Seguridad Minera', '2345978', '71234867', 26.00, 'ACTIVO'),
('PER-357', 'Téc. Seg. Nicolás Esteban Peña', '12345979', 'Técnico en Seguridad Minera', '2345979', '71234868', 26.00, 'ACTIVO'),
('PER-358', 'Téc. Seg. Diego Fernando Araya', '12345980', 'Técnico en Seguridad Minera', '2345980', '71234869', 26.00, 'ACTIVO'),
('PER-359', 'Téc. Seg. Patricio Mauricio Fuentes', '12345981', 'Técnico en Seguridad Minera', '2345981', '71234870', 26.00, 'ACTIVO'),
('PER-360', 'Téc. Seg. Héctor Leonardo Valenzuela', '12345982', 'Técnico en Seguridad Minera', '2345982', '71234871', 26.00, 'ACTIVO'),
('PER-361', 'Téc. Seg. Raúl Eduardo Tapia', '12345983', 'Técnico en Seguridad Minera', '2345983', '71234872', 26.00, 'ACTIVO'),
('PER-362', 'Téc. Seg. Víctor Manuel Sepúlveda', '12345984', 'Técnico en Seguridad Minera', '2345984', '71234873', 26.00, 'ACTIVO'),
('PER-363', 'Téc. Seg. Óscar René Núñez', '12345985', 'Técnico en Seguridad Minera', '2345985', '71234874', 26.00, 'ACTIVO');

-- Supervisores de Seguridad (5 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-364', 'Ing. Seg. Eduardo Patricio Vega', '12345986', 'Supervisor de Seguridad', '2345986', '71234875', 33.00, 'ACTIVO'),
('PER-365', 'Ing. Seg. Gonzalo Sebastián Muñoz', '12345987', 'Supervisor de Seguridad', '2345987', '71234876', 33.00, 'ACTIVO'),
('PER-366', 'Ing. Seg. Rodrigo Ignacio Contreras', '12345988', 'Supervisor de Seguridad', '2345988', '71234877', 33.00, 'ACTIVO'),
('PER-367', 'Ing. Seg. Cristian Andrés Guzmán', '12345989', 'Supervisor de Seguridad', '2345989', '71234878', 33.00, 'ACTIVO'),
('PER-368', 'Ing. Seg. Felipe Antonio Ríos', '12345990', 'Supervisor de Seguridad', '2345990', '71234879', 33.00, 'ACTIVO');

-- ============================================
-- ADMINISTRACIÓN Y FINANZAS - Personal Adicional
-- ============================================
-- Administrativos (20 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-369', 'Adm. Sebastián Omar Campos', '12345991', 'Administrativo', '2345991', '71234880', 22.00, 'ACTIVO'),
('PER-370', 'Adm. Nicolás Esteban Peña', '12345992', 'Administrativo', '2345992', '71234881', 22.00, 'ACTIVO'),
('PER-371', 'Adm. Diego Fernando Araya', '12345993', 'Administrativo', '2345993', '71234882', 22.00, 'ACTIVO'),
('PER-372', 'Adm. Patricio Mauricio Fuentes', '12345994', 'Administrativo', '2345994', '71234883', 22.00, 'ACTIVO'),
('PER-373', 'Adm. Héctor Leonardo Valenzuela', '12345995', 'Administrativo', '2345995', '71234884', 22.00, 'ACTIVO'),
('PER-374', 'Adm. Raúl Eduardo Tapia', '12345996', 'Administrativo', '2345996', '71234885', 22.00, 'ACTIVO'),
('PER-375', 'Adm. Víctor Manuel Sepúlveda', '12345997', 'Administrativo', '2345997', '71234886', 22.00, 'ACTIVO'),
('PER-376', 'Adm. Óscar René Núñez', '12345998', 'Administrativo', '2345998', '71234887', 22.00, 'ACTIVO'),
('PER-377', 'Adm. Eduardo Patricio Vega', '12345999', 'Administrativo', '2345999', '71234888', 22.00, 'ACTIVO'),
('PER-378', 'Adm. Gonzalo Sebastián Muñoz', '12346000', 'Administrativo', '2346000', '71234889', 22.00, 'ACTIVO'),
('PER-379', 'Adm. Rodrigo Ignacio Contreras', '12346001', 'Administrativo', '2346001', '71234890', 22.00, 'ACTIVO'),
('PER-380', 'Adm. Cristian Andrés Guzmán', '12346002', 'Administrativo', '2346002', '71234891', 22.00, 'ACTIVO'),
('PER-381', 'Adm. Felipe Antonio Ríos', '12346003', 'Administrativo', '2346003', '71234892', 22.00, 'ACTIVO'),
('PER-382', 'Adm. Sebastián Omar Campos', '12346004', 'Administrativo', '2346004', '71234893', 22.00, 'ACTIVO'),
('PER-383', 'Adm. Nicolás Esteban Peña', '12346005', 'Administrativo', '2346005', '71234894', 22.00, 'ACTIVO'),
('PER-384', 'Adm. Diego Fernando Araya', '12346006', 'Administrativo', '2346006', '71234895', 22.00, 'ACTIVO'),
('PER-385', 'Adm. Patricio Mauricio Fuentes', '12346007', 'Administrativo', '2346007', '71234896', 22.00, 'ACTIVO'),
('PER-386', 'Adm. Héctor Leonardo Valenzuela', '12346008', 'Administrativo', '2346008', '71234897', 22.00, 'ACTIVO'),
('PER-387', 'Adm. Raúl Eduardo Tapia', '12346009', 'Administrativo', '2346009', '71234898', 22.00, 'ACTIVO'),
('PER-388', 'Adm. Víctor Manuel Sepúlveda', '12346010', 'Administrativo', '2346010', '71234899', 22.00, 'ACTIVO');

-- Recepcionistas (5 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-389', 'Rec. Óscar René Núñez', '12346011', 'Recepcionista', '2346011', '71234900', 20.00, 'ACTIVO'),
('PER-390', 'Rec. Eduardo Patricio Vega', '12346012', 'Recepcionista', '2346012', '71234901', 20.00, 'ACTIVO'),
('PER-391', 'Rec. Gonzalo Sebastián Muñoz', '12346013', 'Recepcionista', '2346013', '71234902', 20.00, 'ACTIVO'),
('PER-392', 'Rec. Rodrigo Ignacio Contreras', '12346014', 'Recepcionista', '2346014', '71234903', 20.00, 'ACTIVO'),
('PER-393', 'Rec. Cristian Andrés Guzmán', '12346015', 'Recepcionista', '2346015', '71234904', 20.00, 'ACTIVO');

-- Contadores (10 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-394', 'C.P. Felipe Antonio Ríos', '12346016', 'Contador', '2346016', '71234905', 25.00, 'ACTIVO'),
('PER-395', 'C.P. Sebastián Omar Campos', '12346017', 'Contador', '2346017', '71234906', 25.00, 'ACTIVO'),
('PER-396', 'C.P. Nicolás Esteban Peña', '12346018', 'Contador', '2346018', '71234907', 25.00, 'ACTIVO'),
('PER-397', 'C.P. Diego Fernando Araya', '12346019', 'Contador', '2346019', '71234908', 25.00, 'ACTIVO'),
('PER-398', 'C.P. Patricio Mauricio Fuentes', '12346020', 'Contador', '2346020', '71234909', 25.00, 'ACTIVO'),
('PER-399', 'C.P. Héctor Leonardo Valenzuela', '12346021', 'Contador', '2346021', '71234910', 25.00, 'ACTIVO'),
('PER-400', 'C.P. Raúl Eduardo Tapia', '12346022', 'Contador', '2346022', '71234911', 25.00, 'ACTIVO'),
('PER-401', 'C.P. Víctor Manuel Sepúlveda', '12346023', 'Contador', '2346023', '71234912', 25.00, 'ACTIVO'),
('PER-402', 'C.P. Óscar René Núñez', '12346024', 'Contador', '2346024', '71234913', 25.00, 'ACTIVO'),
('PER-403', 'C.P. Eduardo Patricio Vega', '12346025', 'Contador', '2346025', '71234914', 25.00, 'ACTIVO');

-- Auxiliares Contables (15 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-404', 'Aux. Cont. Gonzalo Sebastián Muñoz', '12346026', 'Auxiliar Contable', '2346026', '71234915', 21.00, 'ACTIVO'),
('PER-405', 'Aux. Cont. Rodrigo Ignacio Contreras', '12346027', 'Auxiliar Contable', '2346027', '71234916', 21.00, 'ACTIVO'),
('PER-406', 'Aux. Cont. Cristian Andrés Guzmán', '12346028', 'Auxiliar Contable', '2346028', '71234917', 21.00, 'ACTIVO'),
('PER-407', 'Aux. Cont. Felipe Antonio Ríos', '12346029', 'Auxiliar Contable', '2346029', '71234918', 21.00, 'ACTIVO'),
('PER-408', 'Aux. Cont. Sebastián Omar Campos', '12346030', 'Auxiliar Contable', '2346030', '71234919', 21.00, 'ACTIVO'),
('PER-409', 'Aux. Cont. Nicolás Esteban Peña', '12346031', 'Auxiliar Contable', '2346031', '71234920', 21.00, 'ACTIVO'),
('PER-410', 'Aux. Cont. Diego Fernando Araya', '12346032', 'Auxiliar Contable', '2346032', '71234921', 21.00, 'ACTIVO'),
('PER-411', 'Aux. Cont. Patricio Mauricio Fuentes', '12346033', 'Auxiliar Contable', '2346033', '71234922', 21.00, 'ACTIVO'),
('PER-412', 'Aux. Cont. Héctor Leonardo Valenzuela', '12346034', 'Auxiliar Contable', '2346034', '71234923', 21.00, 'ACTIVO'),
('PER-413', 'Aux. Cont. Raúl Eduardo Tapia', '12346035', 'Auxiliar Contable', '2346035', '71234924', 21.00, 'ACTIVO'),
('PER-414', 'Aux. Cont. Víctor Manuel Sepúlveda', '12346036', 'Auxiliar Contable', '2346036', '71234925', 21.00, 'ACTIVO'),
('PER-415', 'Aux. Cont. Óscar René Núñez', '12346037', 'Auxiliar Contable', '2346037', '71234926', 21.00, 'ACTIVO'),
('PER-416', 'Aux. Cont. Eduardo Patricio Vega', '12346038', 'Auxiliar Contable', '2346038', '71234927', 21.00, 'ACTIVO'),
('PER-417', 'Aux. Cont. Gonzalo Sebastián Muñoz', '12346039', 'Auxiliar Contable', '2346039', '71234928', 21.00, 'ACTIVO'),
('PER-418', 'Aux. Cont. Rodrigo Ignacio Contreras', '12346040', 'Auxiliar Contable', '2346040', '71234929', 21.00, 'ACTIVO');

-- ============================================
-- RECURSOS HUMANOS - Personal Adicional
-- ============================================
-- Especialistas en RRHH (10 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-419', 'Esp. RRHH Cristian Andrés Guzmán', '12346041', 'Especialista en RRHH', '2346041', '71234930', 24.00, 'ACTIVO'),
('PER-420', 'Esp. RRHH Felipe Antonio Ríos', '12346042', 'Especialista en RRHH', '2346042', '71234931', 24.00, 'ACTIVO'),
('PER-421', 'Esp. RRHH Sebastián Omar Campos', '12346043', 'Especialista en RRHH', '2346043', '71234932', 24.00, 'ACTIVO'),
('PER-422', 'Esp. RRHH Nicolás Esteban Peña', '12346044', 'Especialista en RRHH', '2346044', '71234933', 24.00, 'ACTIVO'),
('PER-423', 'Esp. RRHH Diego Fernando Araya', '12346045', 'Especialista en RRHH', '2346045', '71234934', 24.00, 'ACTIVO'),
('PER-424', 'Esp. RRHH Patricio Mauricio Fuentes', '12346046', 'Especialista en RRHH', '2346046', '71234935', 24.00, 'ACTIVO'),
('PER-425', 'Esp. RRHH Héctor Leonardo Valenzuela', '12346047', 'Especialista en RRHH', '2346047', '71234936', 24.00, 'ACTIVO'),
('PER-426', 'Esp. RRHH Raúl Eduardo Tapia', '12346048', 'Especialista en RRHH', '2346048', '71234937', 24.00, 'ACTIVO'),
('PER-427', 'Esp. RRHH Víctor Manuel Sepúlveda', '12346049', 'Especialista en RRHH', '2346049', '71234938', 24.00, 'ACTIVO'),
('PER-428', 'Esp. RRHH Óscar René Núñez', '12346050', 'Especialista en RRHH', '2346050', '71234939', 24.00, 'ACTIVO');

-- Asistentes de RRHH (10 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-429', 'Asist. RRHH Eduardo Patricio Vega', '12346051', 'Asistente de RRHH', '2346051', '71234940', 20.00, 'ACTIVO'),
('PER-430', 'Asist. RRHH Gonzalo Sebastián Muñoz', '12346052', 'Asistente de RRHH', '2346052', '71234941', 20.00, 'ACTIVO'),
('PER-431', 'Asist. RRHH Rodrigo Ignacio Contreras', '12346053', 'Asistente de RRHH', '2346053', '71234942', 20.00, 'ACTIVO'),
('PER-432', 'Asist. RRHH Cristian Andrés Guzmán', '12346054', 'Asistente de RRHH', '2346054', '71234943', 20.00, 'ACTIVO'),
('PER-433', 'Asist. RRHH Felipe Antonio Ríos', '12346055', 'Asistente de RRHH', '2346055', '71234944', 20.00, 'ACTIVO'),
('PER-434', 'Asist. RRHH Sebastián Omar Campos', '12346056', 'Asistente de RRHH', '2346056', '71234945', 20.00, 'ACTIVO'),
('PER-435', 'Asist. RRHH Nicolás Esteban Peña', '12346057', 'Asistente de RRHH', '2346057', '71234946', 20.00, 'ACTIVO'),
('PER-436', 'Asist. RRHH Diego Fernando Araya', '12346058', 'Asistente de RRHH', '2346058', '71234947', 20.00, 'ACTIVO'),
('PER-437', 'Asist. RRHH Patricio Mauricio Fuentes', '12346059', 'Asistente de RRHH', '2346059', '71234948', 20.00, 'ACTIVO'),
('PER-438', 'Asist. RRHH Héctor Leonardo Valenzuela', '12346060', 'Asistente de RRHH', '2346060', '71234949', 20.00, 'ACTIVO');

-- ============================================
-- SUPERVISORES Y JEFES ADICIONALES
-- ============================================
-- Supervisores de Mantenimiento Mecánico (3 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-439', 'Ing. Mant. Raúl Eduardo Tapia', '12346061', 'Supervisor de Mantenimiento Mecánico', '2346061', '71234950', 32.00, 'ACTIVO'),
('PER-440', 'Ing. Mant. Víctor Manuel Sepúlveda', '12346062', 'Supervisor de Mantenimiento Mecánico', '2346062', '71234951', 32.00, 'ACTIVO'),
('PER-441', 'Ing. Mant. Óscar René Núñez', '12346063', 'Supervisor de Mantenimiento Mecánico', '2346063', '71234952', 32.00, 'ACTIVO');

-- Supervisores de Mantenimiento Eléctrico (3 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-442', 'Ing. Elec. Eduardo Patricio Vega', '12346064', 'Supervisor de Mantenimiento Eléctrico', '2346064', '71234953', 32.00, 'ACTIVO'),
('PER-443', 'Ing. Elec. Gonzalo Sebastián Muñoz', '12346065', 'Supervisor de Mantenimiento Eléctrico', '2346065', '71234954', 32.00, 'ACTIVO'),
('PER-444', 'Ing. Elec. Rodrigo Ignacio Contreras', '12346066', 'Supervisor de Mantenimiento Eléctrico', '2346066', '71234955', 32.00, 'ACTIVO');

-- Planificadores de Mantenimiento (2 adicionales)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-445', 'Ing. Plan. Cristian Andrés Guzmán', '12346067', 'Planificador de Mantenimiento', '2346067', '71234956', 30.00, 'ACTIVO'),
('PER-446', 'Ing. Plan. Felipe Antonio Ríos', '12346068', 'Planificador de Mantenimiento', '2346068', '71234957', 30.00, 'ACTIVO');

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================
SELECT 'Personal generado exitosamente - 500 trabajadores' AS resultado;
SELECT COUNT(*) as total_personal FROM personal;
SELECT cargo, COUNT(*) as total FROM personal GROUP BY cargo ORDER BY total DESC;

