-- ============================================
-- Script para generar personal profesional y jerárquico
-- Estructura de Empresa Minera
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- ============================================
-- OPERACIONES MINERAS - Personal adicional
-- ============================================
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-056', 'Roberto Sánchez Mendoza', '12345678', 'Operador de Equipos Mineros', '2345678', '71234567', 25.00, 'ACTIVO'),
('PER-057', 'Carlos Ramírez Vargas', '12345679', 'Operador de Equipos Mineros', '2345679', '71234568', 25.00, 'ACTIVO'),
('PER-058', 'Miguel Ángel Torres', '12345680', 'Operador de Equipos Mineros', '2345680', '71234569', 25.00, 'ACTIVO'),
('PER-059', 'José Luis Herrera', '12345681', 'Operador de Equipos Mineros', '2345681', '71234570', 25.00, 'ACTIVO'),
('PER-060', 'Fernando Castro Ruiz', '12345682', 'Operador de Equipos Mineros', '2345682', '71234571', 25.00, 'ACTIVO'),
('PER-061', 'Alejandro Méndez Díaz', '12345683', 'Operador de Equipos Mineros', '2345683', '71234572', 25.00, 'ACTIVO'),
('PER-062', 'Ricardo Flores López', '12345684', 'Operador de Equipos Mineros', '2345684', '71234573', 25.00, 'ACTIVO'),
('PER-063', 'Luis Alberto Morales', '12345685', 'Operador de Equipos Mineros', '2345685', '71234574', 25.00, 'ACTIVO'),
('PER-064', 'Pedro Martínez González', '12345686', 'Operador de Equipos Mineros', '2345686', '71234575', 25.00, 'ACTIVO'),
('PER-065', 'Juan Carlos Silva', '12345687', 'Operador de Equipos Mineros', '2345687', '71234576', 25.00, 'ACTIVO');

-- ============================================
-- SEGURIDAD MINERA - Personal adicional
-- ============================================
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-066', 'Marco Antonio Rojas', '12345688', 'Inspector de Seguridad Minera', '2345688', '71234577', 28.00, 'ACTIVO'),
('PER-067', 'Andrés Felipe Cáceres', '12345689', 'Inspector de Seguridad Minera', '2345689', '71234578', 28.00, 'ACTIVO'),
('PER-068', 'Jorge Eduardo Paredes', '12345690', 'Inspector de Seguridad Minera', '2345690', '71234579', 28.00, 'ACTIVO'),
('PER-069', 'Daniel Esteban Quiroga', '12345691', 'Técnico en Seguridad Minera', '2345691', '71234580', 26.00, 'ACTIVO'),
('PER-070', 'Sergio Iván Velásquez', '12345692', 'Técnico en Seguridad Minera', '2345692', '71234581', 26.00, 'ACTIVO'),
('PER-071', 'Mauricio Alejandro Salinas', '12345693', 'Técnico en Seguridad Minera', '2345693', '71234582', 26.00, 'ACTIVO'),
('PER-072', 'Fabián Rodrigo Espinoza', '12345694', 'Técnico en Seguridad Minera', '2345694', '71234583', 26.00, 'ACTIVO');

-- ============================================
-- MANTENIMIENTO MECÁNICO - Personal adicional
-- ============================================
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-073', 'Eduardo Patricio Vega', '12345695', 'Mecánico de Equipos Pesados', '2345695', '71234584', 27.00, 'ACTIVO'),
('PER-074', 'Gonzalo Sebastián Muñoz', '12345696', 'Mecánico de Equipos Pesados', '2345696', '71234585', 27.00, 'ACTIVO'),
('PER-075', 'Rodrigo Ignacio Contreras', '12345697', 'Mecánico de Equipos Pesados Senior', '2345697', '71234586', 30.00, 'ACTIVO'),
('PER-076', 'Cristian Andrés Guzmán', '12345698', 'Técnico en Hidráulica Industrial', '2345698', '71234587', 28.00, 'ACTIVO'),
('PER-077', 'Felipe Antonio Ríos', '12345699', 'Técnico en Hidráulica Industrial', '2345699', '71234588', 28.00, 'ACTIVO'),
('PER-078', 'Sebastián Omar Campos', '12345700', 'Técnico en Motores Diesel', '2345700', '71234589', 28.00, 'ACTIVO'),
('PER-079', 'Nicolás Esteban Peña', '12345701', 'Soldador Industrial', '2345701', '71234590', 26.00, 'ACTIVO'),
('PER-080', 'Diego Fernando Araya', '12345702', 'Lubricador de Equipos Mineros', '2345702', '71234591', 24.00, 'ACTIVO');

-- ============================================
-- MANTENIMIENTO ELÉCTRICO - Personal adicional
-- ============================================
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-081', 'Patricio Mauricio Fuentes', '12345703', 'Electricista Industrial', '2345703', '71234592', 27.00, 'ACTIVO'),
('PER-082', 'Héctor Leonardo Valenzuela', '12345704', 'Electricista Industrial', '2345704', '71234593', 27.00, 'ACTIVO'),
('PER-083', 'Raúl Eduardo Tapia', '12345705', 'Electricista Industrial', '2345705', '71234594', 27.00, 'ACTIVO'),
('PER-084', 'Víctor Manuel Sepúlveda', '12345706', 'Electricista Industrial', '2345706', '71234595', 27.00, 'ACTIVO'),
('PER-085', 'Óscar René Núñez', '12345707', 'Electricista Industrial', '2345707', '71234596', 27.00, 'ACTIVO');

-- ============================================
-- ADMINISTRACIÓN - Personal adicional
-- ============================================
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-086', 'Patricia Alejandra Moreno', '12345708', 'Administrativo', '2345708', '71234597', 22.00, 'ACTIVO'),
('PER-087', 'María José Fernández', '12345709', 'Administrativo', '2345709', '71234598', 22.00, 'ACTIVO'),
('PER-088', 'Carolina Andrea Jiménez', '12345710', 'Recepcionista', '2345710', '71234599', 20.00, 'ACTIVO');

-- ============================================
-- CONTABILIDAD - Personal adicional
-- ============================================
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-089', 'Ana María Gutiérrez', '12345711', 'Contador', '2345711', '71234600', 25.00, 'ACTIVO'),
('PER-090', 'Lorena Beatriz Castro', '12345712', 'Auxiliar Contable', '2345712', '71234601', 21.00, 'ACTIVO'),
('PER-091', 'Gabriela Estefanía Rojas', '12345713', 'Auxiliar Contable', '2345713', '71234602', 21.00, 'ACTIVO');

-- ============================================
-- RECURSOS HUMANOS - Personal adicional
-- ============================================
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-092', 'Valentina Paz Soto', '12345714', 'Especialista en RRHH', '2345714', '71234603', 24.00, 'ACTIVO'),
('PER-093', 'Camila Andrea Venegas', '12345715', 'Asistente de RRHH', '2345715', '71234604', 20.00, 'ACTIVO');

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================
SELECT 'Personal generado exitosamente' AS resultado;
SELECT cargo, COUNT(*) as total FROM personal GROUP BY cargo ORDER BY cargo;

