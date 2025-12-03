-- Script SQL para exportar datos usando SELECT y formato CSV compatible
-- Este script genera comandos que se pueden ejecutar manualmente o mediante un script wrapper

SET NAMES utf8mb4;

-- Nota: MySQL requiere permisos especiales para INTO OUTFILE
-- Alternativa: usar mysqldump o exportar mediante aplicación externa

-- Para exportar manualmente cada tabla, usar:
-- SELECT * FROM tabla INTO OUTFILE '/ruta/archivo.csv' 
-- FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '"' 
-- LINES TERMINATED BY '\n';

-- O usar mysqldump con formato CSV:
-- mysqldump -u usuario -p --tab=/ruta/ --fields-terminated-by=, --fields-enclosed-by='"' base_de_datos tabla

