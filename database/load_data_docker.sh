#!/bin/bash

# Script para cargar datos CSV en MySQL desde Docker

echo "📊 Cargando datos en MySQL desde Docker..."
echo ""

# Verificar que el contenedor MySQL esté corriendo
if ! docker ps | grep -q mtto-mysql; then
    echo "❌ El contenedor MySQL no está corriendo. Inicia Docker Compose primero."
    exit 1
fi

# Copiar archivos CSV al contenedor
echo "📁 Copiando archivos CSV al contenedor..."
docker cp database/data mtto-mysql:/tmp/data

# Copiar script SQL al contenedor
echo "📝 Copiando script SQL al contenedor..."
docker cp database/load_data.sql mtto-mysql:/tmp/load_data.sql

# Ejecutar script SQL
echo "🔄 Ejecutando carga de datos..."
docker exec -i mtto-mysql mysql -umtto_user -pmtto_password mtto_db < database/load_data.sql

# Alternativa: cargar directamente desde el contenedor
echo "📊 Cargando datos directamente..."
docker exec mtto-mysql mysql -umtto_user -pmtto_password mtto_db -e "
SET FOREIGN_KEY_CHECKS = 0;
LOAD DATA LOCAL INFILE '/tmp/data/01_maquinaria.csv' INTO TABLE maquinaria FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE '/tmp/data/02_personal.csv' INTO TABLE personal FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE '/tmp/data/03_herramientas.csv' INTO TABLE herramientas FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE '/tmp/data/04_insumos.csv' INTO TABLE insumos FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;
SET FOREIGN_KEY_CHECKS = 1;
"

echo ""
echo "✅ Datos cargados exitosamente!"
echo ""
echo "📊 Verificando datos cargados..."
docker exec mtto-mysql mysql -umtto_user -pmtto_password mtto_db -e "
SELECT 'Maquinaria' as tabla, COUNT(*) as registros FROM maquinaria
UNION ALL SELECT 'Personal', COUNT(*) FROM personal
UNION ALL SELECT 'Herramientas', COUNT(*) FROM herramientas
UNION ALL SELECT 'Insumos', COUNT(*) FROM insumos;
"

