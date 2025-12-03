USE mtto_db;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE mantenimiento_actividades;
TRUNCATE TABLE mantenimiento_insumos;
TRUNCATE TABLE mantenimiento_personal;
TRUNCATE TABLE mantenimientos;
TRUNCATE TABLE actividad_herramientas;
TRUNCATE TABLE actividad_insumos;
TRUNCATE TABLE actividades_mantenimiento;
TRUNCATE TABLE planes_mantenimiento;
TRUNCATE TABLE insumos;
TRUNCATE TABLE herramientas;
TRUNCATE TABLE personal;
TRUNCATE TABLE maquinaria;
TRUNCATE TABLE checklists;
TRUNCATE TABLE password_reset_tokens;
TRUNCATE TABLE users;

LOAD DATA LOCAL INFILE '/tmp/data/01_maquinaria.csv' INTO TABLE maquinaria FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales);

LOAD DATA LOCAL INFILE '/tmp/data/02_personal.csv' INTO TABLE personal FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado);

LOAD DATA LOCAL INFILE '/tmp/data/03_herramientas.csv' INTO TABLE herramientas FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, codigo, nombre, marca, estado, categoria, costo);

LOAD DATA LOCAL INFILE '/tmp/data/04_insumos.csv' INTO TABLE insumos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, codigo, nombre, unidad, precio_unitario, cantidad, stock_minimo, categoria);

LOAD DATA LOCAL INFILE '/tmp/data/05_planes_mantenimiento.csv' INTO TABLE planes_mantenimiento FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, maquinaria_id, nombre_plan, tipo_mantenimiento, tipo_plan, @horas_operacion, @intervalo_dias, descripcion, activo) SET horas_operacion = NULLIF(@horas_operacion, ''), intervalo_dias = NULLIF(@intervalo_dias, 'NULL');

LOAD DATA LOCAL INFILE '/tmp/data/06_actividades_mantenimiento.csv' INTO TABLE actividades_mantenimiento FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado);

LOAD DATA LOCAL INFILE '/tmp/data/07_actividad_insumos.csv' INTO TABLE actividad_insumos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, actividad_id, @insumo_id, cantidad, unidad, especificaciones, costo_unitario) SET insumo_id = NULLIF(@insumo_id, 'NULL');

LOAD DATA LOCAL INFILE '/tmp/data/08_actividad_herramientas.csv' INTO TABLE actividad_herramientas FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, actividad_id, @herramienta_id, cantidad, especificaciones) SET herramienta_id = NULLIF(@herramienta_id, 'NULL');

LOAD DATA LOCAL INFILE '/tmp/data/09_mantenimientos.csv' INTO TABLE mantenimientos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, maquinaria_id, @plan_id, tipo_mantenimiento, @fecha_programada, @fecha_ejecucion, horas_maquina, estado, observaciones, costo_mano_obra, costo_insumos) SET plan_id = NULLIF(@plan_id, 'NULL'), fecha_programada = NULLIF(@fecha_programada, 'NULL'), fecha_ejecucion = NULLIF(@fecha_ejecucion, 'NULL');

LOAD DATA LOCAL INFILE '/tmp/data/10_mantenimiento_personal.csv' INTO TABLE mantenimiento_personal FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, mantenimiento_id, personal_id, horas_trabajadas, tarifa_aplicada);

LOAD DATA LOCAL INFILE '/tmp/data/11_mantenimiento_insumos.csv' INTO TABLE mantenimiento_insumos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, mantenimiento_id, insumo_id, cantidad_usada, unidad, precio_unitario);

LOAD DATA LOCAL INFILE '/tmp/data/12_mantenimiento_actividades.csv' INTO TABLE mantenimiento_actividades FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, mantenimiento_id, @actividad_id, descripcion, tiempo_real, completada, observaciones) SET actividad_id = NULLIF(@actividad_id, 'NULL');

LOAD DATA LOCAL INFILE '/tmp/data/13_users.csv' INTO TABLE users FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, username, password, nombre_completo, email, rol, estado, @two_factor_secret, two_factor_enabled, created_at) SET two_factor_secret = NULLIF(@two_factor_secret, '');

LOAD DATA LOCAL INFILE '/tmp/data/14_checklists.csv' INTO TABLE checklists FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, maquinaria_id, fecha, tipo_checklist, codigo_checklist, realizado_por, revisado_por, observaciones, data, created_at, updated_at);

SET FOREIGN_KEY_CHECKS = 1;
SELECT 'Carga completada' as status;
