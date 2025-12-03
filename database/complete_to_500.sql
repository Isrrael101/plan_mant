-- ============================================
-- Script para completar hasta 500 trabajadores
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE mtto_db;

-- Generar 54 trabajadores adicionales para llegar a 500
-- Operadores adicionales (20)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-447', 'Op. Min. Luis Fernando Gutiérrez', '12346069', 'Operador de Equipos Mineros', '2346069', '71234950', 25.00, 'ACTIVO'),
('PER-448', 'Op. Min. Roberto Carlos Méndez', '12346070', 'Operador de Equipos Mineros', '2346070', '71234951', 25.00, 'ACTIVO'),
('PER-449', 'Op. Min. Jorge Alberto Ramírez', '12346071', 'Operador de Equipos Mineros', '2346071', '71234952', 25.00, 'ACTIVO'),
('PER-450', 'Op. Min. Miguel Ángel Sánchez', '12346072', 'Operador de Equipos Mineros', '2346072', '71234953', 25.00, 'ACTIVO'),
('PER-451', 'Op. Min. Carlos Eduardo Torres', '12346073', 'Operador de Equipos Mineros', '2346073', '71234954', 25.00, 'ACTIVO'),
('PER-452', 'Op. Min. Fernando José López', '12346074', 'Operador de Equipos Mineros', '2346074', '71234955', 25.00, 'ACTIVO'),
('PER-453', 'Op. Min. Alejandro Martín Díaz', '12346075', 'Operador de Equipos Mineros', '2346075', '71234956', 25.00, 'ACTIVO'),
('PER-454', 'Op. Min. Ricardo Antonio Flores', '12346076', 'Operador de Equipos Mineros', '2346076', '71234957', 25.00, 'ACTIVO'),
('PER-455', 'Op. Min. Luis Alberto Morales', '12346077', 'Operador de Equipos Mineros', '2346077', '71234958', 25.00, 'ACTIVO'),
('PER-456', 'Op. Min. Pedro Pablo Martínez', '12346078', 'Operador de Equipos Mineros', '2346078', '71234959', 25.00, 'ACTIVO'),
('PER-457', 'Op. Min. Juan Carlos Silva', '12346079', 'Operador de Equipos Mineros', '2346079', '71234960', 25.00, 'ACTIVO'),
('PER-458', 'Op. Min. Roberto Sánchez Mendoza', '12346080', 'Operador de Equipos Mineros', '2346080', '71234961', 25.00, 'ACTIVO'),
('PER-459', 'Op. Min. Carlos Ramírez Vargas', '12346081', 'Operador de Equipos Mineros', '2346081', '71234962', 25.00, 'ACTIVO'),
('PER-460', 'Op. Min. Miguel Ángel Torres', '12346082', 'Operador de Equipos Mineros', '2346082', '71234963', 25.00, 'ACTIVO'),
('PER-461', 'Op. Min. José Luis Herrera', '12346083', 'Operador de Equipos Mineros', '2346083', '71234964', 25.00, 'ACTIVO'),
('PER-462', 'Op. Min. Fernando Castro Ruiz', '12346084', 'Operador de Equipos Mineros', '2346084', '71234965', 25.00, 'ACTIVO'),
('PER-463', 'Op. Min. Alejandro Méndez Díaz', '12346085', 'Operador de Equipos Mineros', '2346085', '71234966', 25.00, 'ACTIVO'),
('PER-464', 'Op. Min. Ricardo Flores López', '12346086', 'Operador de Equipos Mineros', '2346086', '71234967', 25.00, 'ACTIVO'),
('PER-465', 'Op. Min. Luis Alberto Morales', '12346087', 'Operador de Equipos Mineros', '2346087', '71234968', 25.00, 'ACTIVO'),
('PER-466', 'Op. Min. Pedro Martínez González', '12346088', 'Operador de Equipos Mineros', '2346088', '71234969', 25.00, 'ACTIVO');

-- Mecánicos adicionales (15)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-467', 'Mec. Juan Carlos Silva', '12346089', 'Mecánico de Equipos Pesados', '2346089', '71234970', 27.00, 'ACTIVO'),
('PER-468', 'Mec. Roberto Sánchez Mendoza', '12346090', 'Mecánico de Equipos Pesados', '2346090', '71234971', 27.00, 'ACTIVO'),
('PER-469', 'Mec. Carlos Ramírez Vargas', '12346091', 'Mecánico de Equipos Pesados', '2346091', '71234972', 27.00, 'ACTIVO'),
('PER-470', 'Mec. Miguel Ángel Torres', '12346092', 'Mecánico de Equipos Pesados', '2346092', '71234973', 27.00, 'ACTIVO'),
('PER-471', 'Mec. José Luis Herrera', '12346093', 'Mecánico de Equipos Pesados', '2346093', '71234974', 27.00, 'ACTIVO'),
('PER-472', 'Mec. Fernando Castro Ruiz', '12346094', 'Mecánico de Equipos Pesados', '2346094', '71234975', 27.00, 'ACTIVO'),
('PER-473', 'Mec. Alejandro Méndez Díaz', '12346095', 'Mecánico de Equipos Pesados', '2346095', '71234976', 27.00, 'ACTIVO'),
('PER-474', 'Mec. Ricardo Flores López', '12346096', 'Mecánico de Equipos Pesados', '2346096', '71234977', 27.00, 'ACTIVO'),
('PER-475', 'Mec. Luis Alberto Morales', '12346097', 'Mecánico de Equipos Pesados', '2346097', '71234978', 27.00, 'ACTIVO'),
('PER-476', 'Mec. Pedro Martínez González', '12346098', 'Mecánico de Equipos Pesados', '2346098', '71234979', 27.00, 'ACTIVO'),
('PER-477', 'Mec. Juan Carlos Silva', '12346099', 'Mecánico de Equipos Pesados', '2346099', '71234980', 27.00, 'ACTIVO'),
('PER-478', 'Mec. Roberto Sánchez Mendoza', '12346100', 'Mecánico de Equipos Pesados', '2346100', '71234981', 27.00, 'ACTIVO'),
('PER-479', 'Mec. Carlos Ramírez Vargas', '12346101', 'Mecánico de Equipos Pesados', '2346101', '71234982', 27.00, 'ACTIVO'),
('PER-480', 'Mec. Miguel Ángel Torres', '12346102', 'Mecánico de Equipos Pesados', '2346102', '71234983', 27.00, 'ACTIVO'),
('PER-481', 'Mec. José Luis Herrera', '12346103', 'Mecánico de Equipos Pesados', '2346103', '71234984', 27.00, 'ACTIVO');

-- Electricistas adicionales (10)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-482', 'Elec. Fernando Castro Ruiz', '12346104', 'Electricista Industrial', '2346104', '71234985', 27.00, 'ACTIVO'),
('PER-483', 'Elec. Alejandro Méndez Díaz', '12346105', 'Electricista Industrial', '2346105', '71234986', 27.00, 'ACTIVO'),
('PER-484', 'Elec. Ricardo Flores López', '12346106', 'Electricista Industrial', '2346106', '71234987', 27.00, 'ACTIVO'),
('PER-485', 'Elec. Luis Alberto Morales', '12346107', 'Electricista Industrial', '2346107', '71234988', 27.00, 'ACTIVO'),
('PER-486', 'Elec. Pedro Martínez González', '12346108', 'Electricista Industrial', '2346108', '71234989', 27.00, 'ACTIVO'),
('PER-487', 'Elec. Juan Carlos Silva', '12346109', 'Electricista Industrial', '2346109', '71234990', 27.00, 'ACTIVO'),
('PER-488', 'Elec. Roberto Sánchez Mendoza', '12346110', 'Electricista Industrial', '2346110', '71234991', 27.00, 'ACTIVO'),
('PER-489', 'Elec. Carlos Ramírez Vargas', '12346111', 'Electricista Industrial', '2346111', '71234992', 27.00, 'ACTIVO'),
('PER-490', 'Elec. Miguel Ángel Torres', '12346112', 'Electricista Industrial', '2346112', '71234993', 27.00, 'ACTIVO'),
('PER-491', 'Elec. José Luis Herrera', '12346113', 'Electricista Industrial', '2346113', '71234994', 27.00, 'ACTIVO');

-- Técnicos en Hidráulica adicionales (5)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-492', 'Téc. Hid. Fernando Castro Ruiz', '12346114', 'Técnico en Hidráulica Industrial', '2346114', '71234995', 28.00, 'ACTIVO'),
('PER-493', 'Téc. Hid. Alejandro Méndez Díaz', '12346115', 'Técnico en Hidráulica Industrial', '2346115', '71234996', 28.00, 'ACTIVO'),
('PER-494', 'Téc. Hid. Ricardo Flores López', '12346116', 'Técnico en Hidráulica Industrial', '2346116', '71234997', 28.00, 'ACTIVO'),
('PER-495', 'Téc. Hid. Luis Alberto Morales', '12346117', 'Técnico en Hidráulica Industrial', '2346117', '71234998', 28.00, 'ACTIVO'),
('PER-496', 'Téc. Hid. Pedro Martínez González', '12346118', 'Técnico en Hidráulica Industrial', '2346118', '71234999', 28.00, 'ACTIVO');

-- Inspectores de Seguridad adicionales (4)
INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado) VALUES
('PER-497', 'Insp. Seg. Juan Carlos Silva', '12346119', 'Inspector de Seguridad Minera', '2346119', '71235000', 28.00, 'ACTIVO'),
('PER-498', 'Insp. Seg. Roberto Sánchez Mendoza', '12346120', 'Inspector de Seguridad Minera', '2346120', '71235001', 28.00, 'ACTIVO'),
('PER-499', 'Insp. Seg. Carlos Ramírez Vargas', '12346121', 'Inspector de Seguridad Minera', '2346121', '71235002', 28.00, 'ACTIVO'),
('PER-500', 'Insp. Seg. Miguel Ángel Torres', '12346122', 'Inspector de Seguridad Minera', '2346122', '71235003', 28.00, 'ACTIVO');

SELECT 'Completado hasta 500 trabajadores' AS resultado;
SELECT COUNT(*) as total_personal FROM personal;

