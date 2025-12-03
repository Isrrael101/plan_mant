-- ============================================
-- Script para importar datos desde CSV a MySQL
-- ============================================
-- Uso: mysql -u usuario -p base_de_datos < import_from_csv.sql
-- O ejecutar cada comando individualmente

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

USE mtto_db;

-- ============================================
-- IMPORTAR DATOS DESDE CSV
-- ============================================
-- Nota: Asegúrate de que los archivos CSV estén en el directorio permitido por MySQL
-- y que tengas permisos FILE

-- Importar maquinaria
LOAD DATA LOCAL INFILE 'database/csv_exports/maquinaria.csv'
INTO TABLE maquinaria
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales, fecha_registro, fecha_actualizacion);

-- Importar personal
LOAD DATA LOCAL INFILE 'database/csv_exports/personal.csv'
INTO TABLE personal
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado, fecha_registro, fecha_actualizacion);

-- Importar herramientas
LOAD DATA LOCAL INFILE 'database/csv_exports/herramientas.csv'
INTO TABLE herramientas
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Importar insumos
LOAD DATA LOCAL INFILE 'database/csv_exports/insumos.csv'
INTO TABLE insumos
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Importar planes_mantenimiento
LOAD DATA LOCAL INFILE 'database/csv_exports/planes_mantenimiento.csv'
INTO TABLE planes_mantenimiento
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Importar actividades_mantenimiento
LOAD DATA LOCAL INFILE 'database/csv_exports/actividades_mantenimiento.csv'
INTO TABLE actividades_mantenimiento
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Importar mantenimientos
LOAD DATA LOCAL INFILE 'database/csv_exports/mantenimientos.csv'
INTO TABLE mantenimientos
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Importar checklists
LOAD DATA LOCAL INFILE 'database/csv_exports/checklists.csv'
INTO TABLE checklists
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Importar users
LOAD DATA LOCAL INFILE 'database/csv_exports/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Importar tablas de relación
LOAD DATA LOCAL INFILE 'database/csv_exports/actividad_herramientas.csv'
INTO TABLE actividad_herramientas
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'database/csv_exports/actividad_insumos.csv'
INTO TABLE actividad_insumos
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'database/csv_exports/mantenimiento_actividades.csv'
INTO TABLE mantenimiento_actividades
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'database/csv_exports/mantenimiento_insumos.csv'
INTO TABLE mantenimiento_insumos
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'database/csv_exports/mantenimiento_personal.csv'
INTO TABLE mantenimiento_personal
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

SELECT 'Importación completada exitosamente' AS resultado;

